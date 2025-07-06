"use client";

import Image from "next/image";
import x from "@/images/cards/x.png";
import o from "@/images/cards/o.png";
import extend from "@/images/cards/extenda.png"; // APNG ANIMATED!
import lowercase from "@/images/cards/lowercase.png";
import blocked from "@/images/cards/blocked.png";
import neutralize from "@/images/cards/neutral.png";
import back from "@/images/cards/deck-back.png";
import inc from "@/images/cards/inc-win.png";
import dec from "@/images/cards/dec-win.png";
import styles from "@/components/card.module.css";
import { Card as C } from "@/types/game";
import { useCallback, useEffect, useRef } from "react";

// pick correct image src
export function cardSrc(card: C) {
  if (card === C.O) return o.src;
  if (card === C.X) return x.src;
  if (card === C.Neutralize) return neutralize.src;
  if (card === C.Lowercase) return lowercase.src;
  if (card === C.Block) return blocked.src;
  if (card === C.Extend) return extend.src;
  if (card === C.IncrementWinLength) return inc.src;
  if (card === C.DecrementWinLength) return dec.src;

  return back.src;
}

const MAX_WIND_ANGLE = 30;
const WIND_RESPONSIVENESS = 0.5;
const VELOCITY_SAMPLES = 5;
const MIN_VELOCITY_THRESHOLD = 0.05;

enum ReturnPhase {
  NONE = 0,
  MOVING_TO_ORIGIN = 1,
}

const WIDTH = 71;
const HEIGHT = 95;

export function Card({
  card,
  id,
  droppable,
  onDrop,
  angle,
  translateY,
}: {
  card: C;
  id: number;
  droppable: boolean;
  onDrop?: (card: C, x: number, y: number) => boolean;
  angle?: number;
  translateY?: number;
}) {
  const cardRef = useRef<HTMLImageElement>(null);

  const stateRef = useRef({
    dragging: false,
    returnPhase: ReturnPhase.NONE,
    windAngle: 0,
    x: 0,
    y: 0,
    rotation: 0,
  });

  const windRef = useRef({
    lastPosition: { x: 0, y: 0 },
    lastTime: 0,
    velocityBuffer: [] as number[],
    animationFrame: null as number | null,
  });

  const updateTransform = useCallback(() => {
    const card = cardRef.current;
    if (card) {
      const { x, y, rotation } = stateRef.current;
      card.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
    }
  }, []);

  const updateWindEffect = useCallback(
    (currentTime: number) => {
      const state = stateRef.current;
      const wind = windRef.current;

      if (!state.dragging || state.returnPhase !== ReturnPhase.NONE) return;

      const deltaTime = currentTime - wind.lastTime;

      if (deltaTime > 3) {
        const deltaX = state.x - wind.lastPosition.x;
        const velocity = ((deltaX * 50) / deltaTime) * 3;

        // Efficient velocity smoothing
        wind.velocityBuffer.push(velocity);
        if (wind.velocityBuffer.length > VELOCITY_SAMPLES) {
          wind.velocityBuffer.shift();
        }

        // Fast weighted average calculation
        let sum = 0;
        let weightSum = 0;
        for (let i = 0; i < wind.velocityBuffer.length; i++) {
          const weight = i + 1;
          sum += wind.velocityBuffer[i] * weight;
          weightSum += weight;
        }
        const smoothVelocity = weightSum > 0 ? sum / weightSum : 0;

        // Wind angle calculation
        if (Math.abs(smoothVelocity) > MIN_VELOCITY_THRESHOLD) {
          const direction = smoothVelocity > 0 ? 1 : -1;
          const velocityRatio = Math.min(Math.abs(smoothVelocity) / 20, 1);
          const targetAngle = direction * velocityRatio * MAX_WIND_ANGLE;
          state.windAngle +=
            (targetAngle - state.windAngle) * WIND_RESPONSIVENESS;
        } else {
          state.windAngle *= 0.88;
        }

        wind.lastPosition.x = state.x;
        wind.lastTime = currentTime;
      }

      // Apply clamped rotation
      state.rotation = Math.max(
        -MAX_WIND_ANGLE,
        Math.min(MAX_WIND_ANGLE, state.windAngle),
      );
      updateTransform();

      if (state.dragging && state.returnPhase === ReturnPhase.NONE) {
        wind.animationFrame = requestAnimationFrame(updateWindEffect);
      }
    },
    [updateTransform],
  );

  const startWindEffect = useCallback(() => {
    const wind = windRef.current;
    wind.lastPosition.x = stateRef.current.x;
    wind.velocityBuffer = [];

    requestAnimationFrame(updateWindEffect);
  }, [updateWindEffect]);

  const stopWindEffect = useCallback(() => {
    const wind = windRef.current;
    const state = stateRef.current;

    if (wind.animationFrame) {
      cancelAnimationFrame(wind.animationFrame);
      wind.animationFrame = null;
    }

    // Clear velocity buffer immediately to prevent continued wind updates
    wind.velocityBuffer = [];

    // Only reset wind if not returning to origin
    if (!state.dragging && state.returnPhase === ReturnPhase.NONE) {
      const resetWind = () => {
        state.windAngle *= 0.9;
        if (Math.abs(state.windAngle) < 0.15) {
          state.windAngle = 0;
          state.rotation = 0;
        } else {
          state.rotation = Math.max(
            -MAX_WIND_ANGLE,
            Math.min(MAX_WIND_ANGLE, state.windAngle),
          );
          requestAnimationFrame(resetWind);
        }
        updateTransform();
      };
      resetWind();
    }
  }, [updateTransform]);

  const returnToOrigin = useCallback(() => {
    const state = stateRef.current;
    const wind = windRef.current;
    const startX = state.x;
    const startY = state.y;
    const distance = Math.hypot(startX, startY);

    // Immediately stop all wind effects and clear state
    if (wind.animationFrame) {
      cancelAnimationFrame(wind.animationFrame);
      wind.animationFrame = null;
    }
    wind.velocityBuffer = [];
    state.windAngle = 0;
    state.returnPhase = ReturnPhase.MOVING_TO_ORIGIN;

    // Set rotation immediately to face origin and lock it
    const targetRotation = Math.atan2(-startY, -startX) * (180 / Math.PI) + 90;
    state.rotation = targetRotation;

    const duration = Math.min(Math.max(distance / 1500, 0.15), 0.4) * 1000;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease-out-cubic
      const t = 1 - Math.pow(1 - progress, 3);

      state.x = startX * (1 - t);
      state.y = startY * (1 - t);
      // Keep rotation locked during return
      state.rotation = targetRotation;
      updateTransform();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        state.x = 0;
        state.y = 0;
        state.rotation = 0;
        state.returnPhase = ReturnPhase.NONE;
        updateTransform();
        cardRef.current?.classList.add(styles.wave);
      }
    };

    requestAnimationFrame(animate);
  }, [updateTransform]);

  // Optimized pointer handlers
  const handlePointerDown = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;

    const state = stateRef.current;

    state.dragging = true;
    card.style.zIndex = "11";
    cardRef.current?.classList.remove(styles.wave);

    state.returnPhase = ReturnPhase.NONE;

    startWindEffect();
  }, [startWindEffect]);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const state = stateRef.current;

      if (!state.dragging) return;

      const card = cardRef.current;
      const parent = card?.parentElement;
      if (!card || !parent) return;

      state.x += e.movementX;
      state.y += e.movementY;
      updateTransform();
    },
    [updateTransform],
  );

  const handlePointerUp = useCallback(() => {
    const state = stateRef.current;
    if (!state.dragging) return;

    const elCard = cardRef.current;
    if (!elCard) return;

    state.dragging = false;
    elCard.style.zIndex = "10";

    stopWindEffect();

    if (!droppable) {
      // This card cannot be dropped, always return
      returnToOrigin();
      return;
    }

    // Optimized drop zone detection
    const cardRect = elCard.getBoundingClientRect();
    const centerX = cardRect.left + cardRect.width / 2;
    const centerY = cardRect.top + cardRect.height / 2;

    const dropZones = document.querySelectorAll("[data-board-cell]");

    for (const zone of dropZones) {
      const zoneRect = zone.getBoundingClientRect();
      if (
        centerX >= zoneRect.left - 25 &&
        centerX <= zoneRect.right + 25 &&
        centerY >= zoneRect.top - 25 &&
        centerY <= zoneRect.bottom + 25
      ) {
        const x = Number(zone.getAttribute("data-board-cell-x"));
        const y = Number(zone.getAttribute("data-board-cell-y"));

        if (!onDrop?.(card, x, y)) {
          // The move was NOT a valid move, return the card.
          returnToOrigin();
        }

        return; // Stop checking all other zones and return early
      }
    }

    returnToOrigin(); // If card is not in a drop zone, return it.
  }, [stopWindEffect, onDrop, droppable, card, returnToOrigin]);

  useEffect(() => {
    const card = cardRef.current;
    const wind = windRef.current;

    if (!card) return;

    card.addEventListener("pointerdown", handlePointerDown, { passive: true });
    document.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    document.addEventListener("pointerup", handlePointerUp, { passive: true });

    return () => {
      card.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);

      if (wind.animationFrame) {
        cancelAnimationFrame(wind.animationFrame);
      }
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp]);

  return (
    <Image
      ref={cardRef}
      unoptimized={card === C.Extend} // APNG
      width={WIDTH}
      height={HEIGHT}
      draggable={false}
      alt="Card"
      src={cardSrc(card)}
      className={`transition-transform duration-300 ease-out hover:-translate-y-4 ${styles.wave}`}
      style={{
        zIndex: 10,
        ["--base-transform" as string]: `translate(0px, ${translateY ?? 0}px) rotate(${angle ?? 0}deg)`,
        animationDelay: `-${((id * 16807) % 1000) / 1000}s`,
      }}
    />
  );
}
