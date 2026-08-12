"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scrolls to a results region after an action updates bottom-of-page output.
 * Call `requestScroll()` right before updating result state.
 */
export function useScrollToResults(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollToken, setScrollToken] = useState(0);

  useEffect(() => {
    if (!scrollToken || !active) return;
    const node = ref.current;
    if (!node) return;
    requestAnimationFrame(() => {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [scrollToken, active]);

  return {
    resultsRef: ref,
    requestScroll: () => {
      setScrollToken((token) => token + 1);
    },
  };
}
