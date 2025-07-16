import { cn } from "@/lib/utils";
import styles from "./crt.module.css";

export default function CrtFilter() {
  return (
    <div>
      {/* Screen warp (beta)
    <svg xmlns="http://www.w3.org/2000/svg" height={0} width={0} className="absolute">
      <defs>
          <filter
            id="crt-warp"
            x="0"
            y="0"
            width="100%"
            height="100%"
            //filterUnits="userSpaceOnUse"
          >
            <feImage
              href={barrel.src}
              //x="-100%"
              //y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="disp"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="disp"
              scale="100"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
    </svg>*/}

      {/* Global filters */}
      <div
        className={cn(styles.overlay, "z-50")}
        style={{
          backdropFilter: "saturate(1.5)",
        }}
      />

      {/* Scanline overlay */}
      <div className={cn(styles.overlay, styles.scanlines, "z-[49]")} />

      {/* Flicker overlay  */}
      <div className={cn(styles.overlay, styles.flicker, "z-[48]")} />
    </div>
  );
}
