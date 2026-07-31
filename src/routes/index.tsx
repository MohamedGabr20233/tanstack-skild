import { usePostHog } from "@posthog/react";
import { createFileRoute, Link, type ErrorComponentProps } from "@tanstack/react-router";
import { LogIn, Terminal } from "lucide-react";
import SkillCard from "../components/SkillCard";
import NoResults from "../components/NoResults";
import { useAuth } from "#/hooks/useAuth";
import { getSkills } from "../../server/skill.api";


export const Route = createFileRoute("/")({
  component: HomePage,
  errorComponent: HomePageError,
  loader: async () => {
    const result = await getSkills()

    if (!result.success) {
      throw new Error(result.message)
    }

    return result.data
  },
});


function HomePageError({ error, reset }: ErrorComponentProps) {
  return (
    <div id="home">
      <NoResults
        title="Couldn't load skills"
        message={error.message || "Something went wrong while fetching the registry."}
      />
      <div className="mt-4 flex justify-center">
        <button type="button" onClick={reset} className="btn-secondary">
          Try again
        </button>
      </div>
    </div>
  );
}

function HomePage() {
  const posthog = usePostHog();

  const skills = Route.useLoaderData();

  const { isAuthed } = useAuth()

  return (
    <div id="home">
      <section className="hero">
        <div className="copy">
          <h1>
            The Registry for <br />
            <span className="text-gradient">Agentic Inelegance</span>
          </h1>

          <p>A high-performance registry for procedural agent skills. Discover, publish, and operate reusable agent capabilities from a route-driven workspace.</p>
        </div>

        <div className="actions">
          <Link to="/skills" search={{ q: "", page: 1 }} className="btn-primary" onClick={() => posthog.capture("browse_registry_clicked")}>
            <Terminal size={18} />
            <span>Browse Registry</span>
          </Link>
          {!isAuthed ?
            /* show if the user isn't authed */
            <Link to="/sign-in/$" className="btn-secondary">
              <LogIn size={16} />
              Sign in to publish a skill
            </Link>
            :
            <Link to="/skills/new" className="btn-secondary" onClick={() => posthog.capture("publish_skill_clicked")}>
              <span>publish skill</span>
            </Link>
          }
        </div>
      </section >

      <section className="latest">
        <div className="space-y-2">
          <h2>
            Top Voted <span className="text-gradient">Skills</span>
          </h2>
          <p>The most upvoted skills in the registry, newest first on ties.</p>
        </div>

        {skills.length > 0 ? (
          <div className="skills-grid">
            {skills.map((skill) => (
              <SkillCard skill={skill} key={skill.id} />
            ))}
          </div>
        ) : (
          <NoResults
            title="No skills yet"
            message="Be the first to publish a skill to the registry."
          />
        )}
      </section>
    </div >
  );
}
