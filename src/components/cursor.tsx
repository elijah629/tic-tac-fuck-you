"use client";

import { play } from "@/lib/settings";
import { SFX_SOUNDS } from "@/types/settings";
import { useEffect, useState } from "react";

export function Cursor({ cursor }: { cursor: string }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;

    const update = (e: PointerEvent) => {
      animationFrameId = requestAnimationFrame(() =>
        setPosition({ x: e.clientX, y: e.clientY }),
      );
    };

    const click = (e: PointerEvent) => {
      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      const interactive = elements.some(
        (x) => x.tagName === "BUTTON" || x.tagName === "A",
      );

      if (interactive) {
        play(SFX_SOUNDS.EXPLODE, false);
      }
    };

    window.addEventListener("pointerdown", click);
    window.addEventListener("pointermove", update);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.addEventListener("pointerdown", click);
      window.removeEventListener("pointermove", update);
    };
  }, []);

  return (
    <div
      className={`fixed z-40 pointer-events-none text-3xl select-none`}
      style={{
        left: position.x + 2,
        top: position.y + 18,
        transform: "translate(-50%, -50%)",
      }}
    >
      {cursor}
    </div>
  );
}
