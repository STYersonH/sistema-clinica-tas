"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import Button from "./Button";

interface NavbarProps {
  color: string;
}

interface ExtendedSessionUser {
  ID: number;
  Tipo?: string | null | undefined; // Add the 'Tipo' property
}

type ColorVariantKey = "yellow" | "blue";

const Navbar = ({ color }: NavbarProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const tipoUser =
    (session?.user as ExtendedSessionUser)?.Tipo === "paciente"
      ? "paciente"
      : "medico";
  const ID = (session?.user as ExtendedSessionUser)?.ID;

  const colorVariants = {
    yellow: "bg-yellow-primary",
    blue: "bg-blue-primary",
  };

  const textColorVariants = {
    yellow: "text-yellow-primary",
    blue: "text-blue-primary",
  };

  return (
    <div
      className={cn(
        "fixed flex h-20 w-screen items-center justify-center",
        color && colorVariants[color as ColorVariantKey],
      )}
    >
      <div className="flex w-[1200px] items-center justify-between">
        <div
          className="flex cursor-pointer items-center gap-x-5"
          onClick={() => {
            router.push(`/dashboard/${tipoUser}`);
          }}
        >
          <Image
            src="/Luxi-Hosting-Logo.svg"
            alt="inicial img"
            width={40}
            height={40}
          />
          <h2 className="text-xl font-bold text-white">CLINICA TAS</h2>
        </div>
        {/*Elementos del Navbar */}
        <div className="flex items-center gap-10">
          <Button
            className={cn(
              "m-0 bg-white px-3 py-1 transition-all hover:bg-stone-400 hover:text-white",
              textColorVariants[color as ColorVariantKey],
            )}
            href={`/dashboard/${tipoUser}/modificarDatos?id=${ID}`}
          >
            Modificar datos personales
          </Button>
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
