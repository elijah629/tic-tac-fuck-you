import React from "react";
import falling from "./falling.module.css";
import { Card as C } from "@/types/game";
import { StaticCard } from "./static-card";
import styles from "./crt.module.css";

export function Falling() {
  return (
    <div
      className={`flex justify-between blur-[2px] -z-10 gap-1 p-2 ${styles.overlay}`}
    >
      {Array.from({ length: 4 }, (_, i) => (
        <React.Fragment key={i}>
          <div
            className={`${falling.falling} text-enemy`}
            style={{
              animationDelay: `${i * 5 + Math.random() * 3}s`,
              animationDuration: `${5 + Math.random() * 2}s`,
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
            }}
          >
            X
          </div>
          <div
            className={falling.falling}
            style={{
              animationDelay: `${i * 5 + Math.random() * 3}s`,
              animationDuration: `${5 + Math.random() * 2}s`,
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
            }}
          >
            <StaticCard card={C.TBD} id={0} />
          </div>
          {/*}<div
            className={`${falling.falling} text-ally`}
            style={{
              animationDelay: `${i * 5 + Math.random() * 3}s`,
              animationDuration: `${5 + Math.random() * 2}s`,
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
            }}
          >
            O
          </div>*/}
          <div
            className={`${falling.falling} sm:block hidden text-enemy`}
            style={{
              animationDelay: `${i * 5 + Math.random() * 3}s`,
              animationDuration: `${5 + Math.random() * 2}s`,
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
            }}
          >
            X
          </div>
          <div
            className={`${falling.falling} sm:block hidden text-ally`}
            style={{
              animationDelay: `${i * 5 + Math.random() * 3}s`,
              animationDuration: `${5 + Math.random() * 2}s`,
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
            }}
          >
            O
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
