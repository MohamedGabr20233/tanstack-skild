import { usePostHog } from "@posthog/react";
import { Link } from "@tanstack/react-router";
import { ArrowBigUp, ArrowUpRight, Bookmark, Check, Clipboard, ClipboardX, MessageSquare } from "lucide-react";
import { useCopyToClipBoard } from "#/lib/utils";
import type { GetSkillsData } from "#/dataconnect-generated";


type SkillCardProps = GetSkillsData['skills'][number];

const SkillCard = ({ skill }: SkillCardProps) => {
  //* ======== destruct the skill variables ========
  const { createdAt, description, id: skillId, author, installCommand, slug, tags, title } = skill;
  const category = tags[0] || "General";

  const { state: copyState, copy: copyFunction } = useCopyToClipBoard();
  const posthog = usePostHog();

  const handleCopy = () => {
    copyFunction(installCommand as string);
    posthog.capture("skill_install_command_copied", {
      skill_id: skillId,
      skill_title: title,
      skill_slug: slug,
      install_command: installCommand,
    });
  };

  const handleOpen = () => {
    posthog.capture("skill_opened", {
      skill_id: skillId,
      skill_title: title,
      skill_slug: slug,
      category,
    });
  };

  return (
    <article className="skill-card">
      <Link to="/skills" tabIndex={-1} aria-label={`Open ${title}`} className="overlay" />
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
            <img src={author.imageUrl || "/logo512.png"} alt={`${author.username}'s avatar`} className="avatar" />
            <div className="author-copy">
              <p>{author.username}</p>
              <p>{createdAt ? new Date(createdAt as string).toLocaleDateString() : "Unknown"}</p>
            </div>
          </div>

          {/* the category */}
          <p className="category">{category}</p>
        </div>

        <div className="summary">
          <Link to="/skills" className="title-link">
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
            <p>{installCommand}</p>
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
            <button className="upvote" type="button" disabled>
              <ArrowBigUp size={16} fill="currentColor" />
              <span>{tags.length}</span>
            </button>

            <div className="comments">
              <MessageSquare size={14} />
              <span>{author.email ? 1 : 0}</span>
            </div>
          </div>

          <div className="actions">
            <Link to="/skills" className="open" title={`Open ${title}`} onClick={handleOpen}>
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
