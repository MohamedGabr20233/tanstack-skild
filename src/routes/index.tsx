import { createFileRoute, Link } from "@tanstack/react-router";
import { Terminal } from "lucide-react";
import SkillCard from "../components/SkillCard";
import { dummySkills } from "../lib/dummy-skills";

export const Route = createFileRoute("/")({ component: HomePage });
function HomePage() {
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
          <Link to="/skills" className="btn-primary">
            <Terminal size={18} />
            <span>Browse Registry</span>
          </Link>
          <Link to="/skills/new" className="btn-secondary">
            <span>publish skill</span>
          </Link>
        </div>
      </section>

      <section className="latest">
        <div className="space-y-2">
          <h2>
            Recently Created <span className="text-gradient">Skills</span>
          </h2>
          <p>Latest skills loaded from Firestone in descending creation order.</p>
        </div>

        {/* the carts */}
        <div>
          {dummySkills.length > 0 ? (
            <div className="skills-grid">
              {dummySkills.map((skill: SkillRecord) => (
                <SkillCard skill={skill} key={skill.id} />
              ))}
            </div>
          ) : (
            <p>No skills have been created yet</p>
          )}
        </div>
      </section>
    </div>
  );
}
