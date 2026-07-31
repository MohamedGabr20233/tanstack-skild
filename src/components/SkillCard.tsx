import { usePostHog } from "@posthog/react";
import { Link } from "@tanstack/react-router";
import { ArrowBigUp, ArrowUpRight, Bookmark, Check, Clipboard, ClipboardX, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCopyToClipBoard } from "#/lib/utils";
import { toggleSkillVote } from "../../server/skill.api";
import type { SkillRecord } from "../../type.d.ts";


type SkillCardProps = { skill: SkillRecord };

const SkillCard = ({ skill }: SkillCardProps) => {
  const { id: skillId, title, description, tags, created_at, install_command, author_email, author_image } = skill;
  const category = tags[0] || "General";
  const authorName = author_email?.split("@")[0] ?? "unknown";

  const [votes, setVotes] = useState(skill.votes_count ?? 0);
  const [hasVoted, setHasVoted] = useState(skill.hasVoted ?? false);
  const [isVoting, setIsVoting] = useState(false);

  const { state: copyState, copy: copyFunction } = useCopyToClipBoard();
  const posthog = usePostHog();

  const handleVote = async () => {
    if (isVoting) return;
    setIsVoting(true);

    // optimistic — reconcile with the server's numbers once it answers
    const nextVoted = !hasVoted;
    setHasVoted(nextVoted);
    setVotes((count) => count + (nextVoted ? 1 : -1));

    const result = await toggleSkillVote({ data: { id: skillId } });

    if (!result.success) {
      setHasVoted(!nextVoted);
      setVotes((count) => count + (nextVoted ? -1 : 1));
      toast.error(result.message);
      setIsVoting(false);
      return;
    }

    setHasVoted(result.hasVoted);
    setVotes(result.votesCount);
    setIsVoting(false);

    posthog.capture(result.hasVoted ? "skill_upvoted" : "skill_upvote_removed", {
      skill_id: skillId,
      skill_title: title,
    });

    // deliberately no router.invalidate(): the count updates in place and the grid
    // re-sorts on the next load, so voting never refetches the list
  };

  const handleCopy = () => {
    copyFunction(install_command);
    posthog.capture("skill_install_command_copied", {
      skill_id: skillId,
      skill_title: title,
      install_command,
    });
  };

  const handleOpen = () => {
    posthog.capture("skill_opened", {
      skill_id: skillId,
      skill_title: title,
      category,
    });
  };

  return (
    <article className="skill-card">
      <Link params={{ skillId: skillId }} to="/skills/$skillId" tabIndex={-1} aria-label={`Open ${title}`} className="overlay" />
      {/* the header */}
      <div className="chrome">
        <div className="chrome-bar">
          <div className="lights">
            <div className="light red" />
            <div className="light amber" />
            <div className="light green" />
          </div>
          <div className="host">registry.sh</div>
        </div>
      </div>

      <div className="body">
        <div className="meta">
          <div className="author">
            {/* google throttles avatar hotlinks that send a referrer — no-referrer keeps them loading */}
            <img
              src={author_image || "/logo512.png"}
              alt={`${authorName}'s avatar`}
              className="avatar"
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/logo512.png";
              }}
            />
            <div className="author-copy">
              <p>{authorName}</p>
              <p>{created_at ? new Date(created_at).toLocaleDateString() : "Unknown"}</p>
            </div>
          </div>

          {/* the category */}
          <p className="category">{category}</p>
        </div>

        <div className="summary">
          <Link params={{ skillId: skillId }} to="/skills/$skillId" className="title-link">
            <h3>{title}</h3>
          </Link>

          <p>{description}</p>
        </div>
        {/*  */}
        <div
          className={`command
           transition-all duration-300
          ${copyState == "success" ? "border-green-800" : copyState === "failed" ? "border-red-800 " : ""}`}
        >
          <div className="command-copy">
            <span>{">_"}</span>
            <p>{install_command}</p>
          </div>

          <button
            onClick={handleCopy}
            className={`copy focus-within:ring-0 outline-0 cursor-pointer transition-all fade-in
            ${copyState === "success" ? "text-green-600" : copyState === "failed" ? "text-red-700" : ""}
            `}
          >
            {copyState === "success" ? <Check size={14} /> : copyState === "failed" ? <ClipboardX size={14} color={"currentColor"} /> : <Clipboard size={14} color={"currentColor"} />}
          </button>
        </div>

        <div className="footer">
          <div className="stats">
            <button
              className={`upvote ${hasVoted ? "voted" : ""}`}
              type="button"
              onClick={handleVote}
              disabled={isVoting}
              aria-pressed={hasVoted}
              aria-label={hasVoted ? `Remove upvote from ${title}` : `Upvote ${title}`}
            >
              <ArrowBigUp size={16} fill={hasVoted ? "currentColor" : "none"} />
              <span>{votes}</span>
            </button>

            <div className="comments">
              <MessageSquare size={14} />
              <span>{author_email ? 1 : 0}</span>
            </div>
          </div>

          <div className="actions">
            <Link params={{ skillId: skillId }} to="/skills/$skillId" className="open" title={`Open ${title}`} onClick={handleOpen}>
              <span>Open</span>
              <ArrowUpRight size={14} />
            </Link>

            <button type="button" className="save" disabled aria-label="Saved State">
              <Bookmark size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default SkillCard;
