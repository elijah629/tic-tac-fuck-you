"use client";

import { Cell } from "@/components/cell";
import { useGame } from "@/lib/game";
import { cn } from "@/lib/utils";
import barrel from "@/assets/images/sphere.png";

export function Board({ className }: { className?: string }) {
  const {
    size: { rows, cols },
    cells,
  } = useGame((s) => s.board);

  const colBound = cols > rows;

  return (
    <div className="flex items-center justify-center @container">
      <svg height={0} width={0}>
        <defs>
          <filter
            id="crt"
            x="0"
            y="0"
            width="100%"
            height="100%"
            filterUnits="userSpaceOnUse"
          >
            <feImage
              href={barrel.src}
              //x="-100%"
              //y="0"
              preserveAspectRatio="none"
              result="disp"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="disp"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
    </svg>
      <div
        className={cn(
          "grid",
          colBound
            ? "max-w-[90cqw] lg:max-w-[60cqw] xl:max-w-[50cqw] w-full h-auto"
            : "max-h-[90cqw] xl:max-h-[50cqw] h-full w-auto",
          className,
        )}
        style={{
          aspectRatio: `${cols}/${rows}`,
          filter: "url(#crt)",
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {cells.map((cell, index) => (
          <Cell key={index} index={index} cell={cell} />
        ))}
      </div>
    </div>
  );
}
