const SkillCardPending = () => {
  return (
    <article className="skill-card animate-pulse">
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
            <div className="avatar bg-elevated" />
            <div className="author-copy gap-1.5">
              <div className="h-3 w-20 rounded bg-elevated" />
              <div className="h-2.5 w-14 rounded bg-elevated" />
            </div>
          </div>
          <div className="h-5 w-16 rounded-md bg-elevated" />
        </div>

        <div className="summary">
          <div className="h-5 w-3/4 rounded bg-elevated" />
          <div className="flex flex-col gap-2">
            <div className="h-3 w-full rounded bg-elevated" />
            <div className="h-3 w-full rounded bg-elevated" />
            <div className="h-3 w-2/3 rounded bg-elevated" />
          </div>
        </div>

        <div className="command">
          <div className="h-3 w-1/2 rounded bg-elevated" />
        </div>

        <div className="footer">
          <div className="stats">
            <div className="h-4 w-8 rounded bg-elevated" />
            <div className="h-4 w-8 rounded bg-elevated" />
          </div>
          <div className="h-4 w-14 rounded bg-elevated" />
        </div>
      </div>
    </article>
  );
};

export const SkillsGridPending = ({ count = 6 }: { count?: number }) => (
  <div className="skills-grid">
    {Array.from({ length: count }, (_, i) => (
      <SkillCardPending key={i} />
    ))}
  </div>
);

export default SkillCardPending;
