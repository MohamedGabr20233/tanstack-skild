import { usePostHog } from "@posthog/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Terminal } from "lucide-react";
import SkillCard from "../components/SkillCard";
import { createServerFn } from "@tanstack/react-start";
import { dataConnect } from "#/lib/firebase";
import { getSkills } from "#/dataconnect-generated";

const getSkillsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      // * {destructedVariable} = await QueryFn(DataConnector , {param1 : value1 , param2 : value2})"})
      const { data } = await getSkills(dataConnect, {
        searchTerm: "",
        limit: 10,
      })

      return data.skills
    } catch (e) {
      console.log(e)
      return []
    }
  })
export const Route = createFileRoute("/")({ component: HomePage, loader: () => getSkillsFn() });



function HomePage() {
  const posthog = usePostHog();

  const skills = Route.useLoaderData();


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
          <Link to="/" className="btn-primary" onClick={() => posthog.capture("browse_registry_clicked")}>
            <Terminal size={18} />
            <span>Browse Registry</span>
          </Link>
          <Link to="/" className="btn-secondary" onClick={() => posthog.capture("publish_skill_clicked")}>
            <span>publish skill</span>
          </Link>
        </div>
      </section >

      <section className="latest">
        <div className="space-y-2">
          <h2>
            Recently Created <span className="text-gradient">Skills</span>
          </h2>
          <p>Latest skills loaded from Firestone in descending creation order.</p>
        </div>

        {/* the carts */}
        <div>
          {skills.length > 0 ? (
            <div className="skills-grid">
              {skills.map((skill) => (
                <SkillCard skill={skill} key={skill.id} />
              ))}
            </div>
          ) : (
            <p>No skills have been created yet</p>
          )}
        </div>
      </section>
    </div >
  );
}
