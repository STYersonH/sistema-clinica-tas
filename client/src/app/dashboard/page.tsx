"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ExtendedSessionUser {
  ID: number;
  Tipo?: string | null; // Add the 'Tipo' property
}

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ejecutar el efecto cuando se actualice la sesion
  useEffect(() => {
    // redirigir a la pagina correspondiente segun el tipo de usuario
    if ((session?.user as ExtendedSessionUser)?.Tipo == "paciente") {
      router.push("/dashboard/paciente");
    } else {
      router.push("/dashboard/medico");
    }
  });

  return (
    <div className="flex h-screen items-center justify-center">
      <Image src="/loading.png" alt="loading" width={50} height={50} />
    </div>
  );
};

export default DashboardPage;
