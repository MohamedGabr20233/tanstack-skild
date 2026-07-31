import { Check, Clipboard, ClipboardX } from "lucide-react";
import type { ReactNode } from "react";
import { useCopyToClipBoard } from "#/lib/utils";

type CodeBlockProps = {
  title: string;
  icon: ReactNode;
  code: string;
  onCopy?: () => void;
};

const CodeBlock = ({ title, icon, code, onCopy }: CodeBlockProps) => {
  const { state: copyState, copy: copyFunction } = useCopyToClipBoard();

  const handleCopy = () => {
    copyFunction(code);
    onCopy?.();
  };

  return (
    <section className="code-block">
      <header>
        <div className="label">
          {icon}
          <h2>{title}</h2>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`copy transition-colors
          ${copyState === "success" ? "text-green-600" : copyState === "failed" ? "text-red-700" : ""}`}
          aria-label={`Copy ${title.toLowerCase()}`}
        >
          {copyState === "success" ? <Check size={14} /> : copyState === "failed" ? <ClipboardX size={14} /> : <Clipboard size={14} />}
          <span>{copyState === "success" ? "Copied" : "Copy"}</span>
        </button>
      </header>

      <pre>
        <code>{code}</code>
      </pre>
    </section>
  );
};

export default CodeBlock;
