import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { useCallback, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//* clipboard copy

export const useCopyToClipBoard = (resetDelay = 1000) => {
  const [state, setState] = useState<"success" | "failed" | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setState("success");
    } catch (e) {
      console.log(e);
      setState("failed");
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setState(null), resetDelay);
  }, []);

  return { state, copy };
};
