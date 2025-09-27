// hooks/useAutoScroll.js
import { useLayoutEffect, useRef } from "react";

export default function useAutoScroll(dependencies = []) {
  const containerRef = useRef(null);
  const endRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const NEAR_BOTTOM_THRESHOLD = 150;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      NEAR_BOTTOM_THRESHOLD;

    if (isNearBottom) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
        endRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, dependencies);

  return { containerRef, endRef };
}
