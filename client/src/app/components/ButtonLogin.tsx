"use client";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

// Step 1: Define prop types
type ButtonLoginProps = {
  href: string;
};

// Step 2: Use React.FC for the component
const ButtonLogin: React.FC<ButtonLoginProps> = ({ href }) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <button
      onClick={handleClick}
      className="mr-10 mt-10 rounded-full bg-green-400 px-16 py-3 text-xl font-bold text-white transition-colors duration-200 hover:bg-green-500"
    >
      LOGIN
    </button>
  );
};

export default ButtonLogin;
