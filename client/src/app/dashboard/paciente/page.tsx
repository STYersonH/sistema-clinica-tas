"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const PacientePage = () => {
  const router = useRouter();
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      PACIENTE PAGE
      <button
        className="mt-5 rounded-2xl bg-red-500 px-6 py-2 text-white hover:bg-red-600"
        onClick={() => signOut()}
      >
        GET OUT
      </button>
    </div>
  );
};

export default PacientePage;
