import { Terminal } from "lucide-react";

type NoResultsProps = {
  title?: string;
  message?: string;
};

const NoResults = ({
  title = "No results found",
  message = "Nothing to show here yet.",
}: NoResultsProps) => {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border-subtle bg-surface px-6 py-16 text-center">
      <Terminal size={28} className="text-text-muted/50" />
      <h3 className="text-lg font-semibold text-black dark:text-white">{title}</h3>
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  );
};

export default NoResults;
