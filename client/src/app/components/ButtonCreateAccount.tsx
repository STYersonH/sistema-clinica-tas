"use client";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

// Step 1: Define prop types
type ButtonCreateAccountProps = {
  img: string;
  imgSize: number;
  tipo: string;
  href: string;
};

// Step 2: Use React.FC for the component
const ButtonCreateAccount: React.FC<ButtonCreateAccountProps> = ({
  img,
  imgSize,
  tipo,
  href,
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <button
      onClick={handleClick}
      className="group flex items-center gap-3 rounded-3xl bg-blue-primary px-12 py-2 transition-colors duration-300 hover:bg-blue-500"
      aria-label={`Create account as ${tipo}`} // Step 4: Improve accessibility
    >
      <Image
        src={img}
        width={imgSize}
        height={imgSize}
        className="transition-transform duration-200 group-hover:scale-150"
        alt="" // Consider providing a meaningful alt text or handling the error state
      />
      <p className="text-2xl font-bold text-white">CREAR CUENTA COMO {tipo}</p>
    </button>
  );
};

export default ButtonCreateAccount;
