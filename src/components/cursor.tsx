"use client";

import { useEffect, useState } from "react";

export default function TTFUCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const update = (e: MouseEvent) =>
      setPosition({ x: e.clientX, y: e.clientY });

    window.addEventListener("mousemove", update, { passive: true });

    return () => {
      window.removeEventListener("mousemove", update);
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
