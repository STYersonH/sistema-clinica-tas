"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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

  return <div>dashboardPage</div>;
};

export default DashboardPage;
