"use client";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Step 1: Define prop types
type ButtonProps = {
  href: string;
  children: React.ReactNode;
  color?: string;
  className?: string;
};

type ColorVariantKey = "yellow" | "blue";

// Step 2: Use React.FC for the component
const Button: React.FC<ButtonProps> = ({
  href,
  children,
  color,
  className,
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(href);
  };

  const colorVariants = {
    yellow: "bg-yellow-primary hover:bg-yellow-dark",
    blue: "bg-blue-primary hover:bg-blue-dark",
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "mt-10 rounded-full bg-green-400 px-16 py-3 text-xl font-bold text-white transition-colors duration-200 hover:bg-green-500",
        color && colorVariants[color as ColorVariantKey],
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
