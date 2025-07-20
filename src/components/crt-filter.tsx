import { cn } from "@/lib/utils";
import styles from "@/components/crt.module.css";
import barrel from "@/assets/images/sphere.png";

export default function CrtFilter() {
  return (
    <div>
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
