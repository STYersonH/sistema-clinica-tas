"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  color: string;
}

type ColorVariantKey = "yellow" | "blue";

const Navbar = ({ color }: NavbarProps) => {
  const colorVariants = {
    yellow: "bg-yellow-primary",
    blue: "bg-blue-primary",
  };

  return (
    <div
      className={cn(
        "fixed flex h-16 w-screen items-center justify-center",
        color && colorVariants[color as ColorVariantKey],
      )}
    >
      <div className="flex w-[1200px] items-center justify-between">
        <div className="flex items-center gap-x-5">
          <Image
            src="/Luxi-Hosting-Logo.svg"
            alt="inicial img"
            width={40}
            height={40}
          />
          <h2 className="text-xl font-bold text-white">CLINICA TAS</h2>
        </div>
        {/*Elementos del Navbar */}
        <div>
          <button onClick={() => signOut()}>
            <AiOutlineLogout
              className="text-white transition-all hover:scale-125"
              fontSize="30px"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
