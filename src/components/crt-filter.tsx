import { cn } from "@/lib/utils";
import styles from "@/components/crt.module.css";
import barrel from "@/assets/images/barrel.png";

export default function CrtFilter() {
  return (
    <div>


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
