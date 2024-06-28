"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { getHistorialUsuario } from "../../../apiRoutes/historialClinic/historialClinic.api";
import HistorialClinico from "../../medico/historialClinico/page";
import RecetaMedica from "@/components/tratamientoMedico/RecetaMedica";
import Diagnostico from "@/components/tratamientoMedico/Diagnostico";
import DatosMedicoACargo from "@/components/tratamientoMedico/DatosMedicoACargo";

const TratamientoPage = () => {
  const searchParams = useSearchParams();
  const dniPaciente = searchParams.get("dniPaciente");

  const [DNIusuario, setDNIusuario] = useState<any>(dniPaciente);

  const router = useRouter();
  const { data: session, status } = useSession();
  const [historialClinico, setHistorialClinico] = useState<any>([]);
  const datosUsuarioSession = session?.user;

  useEffect(() => {
    const fetchHistorialClinico = async (IDuser: string) => {
      const response = await getHistorialUsuario(IDuser);
      // console.log(response.data.data);
      setHistorialClinico(response.data.data[0]);
    };

    fetchHistorialClinico(DNIusuario);
  }, [DNIusuario]);

  return (
    <main className="flex w-screen justify-center">
      <div className="mb-20 flex w-[1150px] flex-col items-center justify-center gap-y-10">
        <div
          className="mt-28 flex items-center gap-10"
          onClick={() => {
            router.push("/dashboard/paciente");
          }}
        >
          <div className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-yellow-primary text-4xl font-bold text-white">
            <FaAngleLeft className="text-xl transition-transform duration-200 group-hover:scale-125" />
          </div>
          <h1 className="text-3xl font-bold text-yellow-primary">
            TRATAMIENTO MEDICO
          </h1>
        </div>
        {/* Datos del medico a cargo*/}
        <DatosMedicoACargo historialClinico={historialClinico} />
        {/* DIAGNOSTICO */}
        <Diagnostico historialClinico={historialClinico} />
        {/* RECETA MEDICA */}
        <RecetaMedica historialClinico={historialClinico} />
      </div>
    </main>
  );
};

export default TratamientoPage;
