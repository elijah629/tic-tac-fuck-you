"use client";

import type React from "react";
import { HTMLProps, useState } from "react";
import shake from "./shaking.module.css";
import { Input } from "./ui/input";

export function ShakingInput({
  onChange,
  className = "",
  value,
  ...props
}: {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  value?: string;
} & HTMLProps<HTMLInputElement>) {
  const [isShaking, setIsShaking] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsShaking(true);

    if (onChange) {
      onChange(e);
    }

    setTimeout(() => setIsShaking(false), 400);
  };

  return (
    <Input
      {...props}
      value={value}
      onChange={handleChange}
      className={`${className} ${isShaking ? shake.shake : ""}`}
    />
  );
}
