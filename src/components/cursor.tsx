"use client";

import { useEffect, useState } from "react";

export default function TTFUCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;

    const update = (e: PointerEvent) => {
      animationFrameId = requestAnimationFrame(() =>
        setPosition({ x: e.clientX, y: e.clientY }),
      );
    };

    window.addEventListener("pointermove", update);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", update);
    };
  }, []);

  return (
    <div
      className="fixed z-[20] pointer-events-none text-3xl select-none"
      style={{
        left: position.x + 2,
        top: position.y + 18,
        transform: "translate(-50%, -50%)",
      }}
    >
      🖕
    </div>
  );
}
