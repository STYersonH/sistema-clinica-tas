"use client";
import React, { useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";

import { useRouter, useSearchParams } from "next/navigation";
import { obtenerDatosDeUnaConsultaRealizada } from "@/app/apiRoutes/historialClinic/historialClinic.api";
import DatosMedicoACargo from "@/components/tratamientoMedico/DatosMedicoACargo";
import Diagnostico from "@/components/tratamientoMedico/Diagnostico";
import RecetaMedica from "@/components/tratamientoMedico/RecetaMedica";

const DatosDiagnosticoCita = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const idCitaParam = searchParams.get("IdCita");
  const DNIpacienteParam = searchParams.get("DNIpaciente");

  const [idCita, setIdCita] = useState<any>(idCitaParam);
  const [dniPaciente, setDniPaciente] = useState<any>(DNIpacienteParam);
  const [datosDiagnosticoCita, setDatosDiagnosticoCita] = useState<any>([]);

  useEffect(() => {
    const fetchDatosDiagnosticoCita = async (idCita: string) => {
      const res = await obtenerDatosDeUnaConsultaRealizada(idCita);
      setDatosDiagnosticoCita(res.data.data);
    };

    fetchDatosDiagnosticoCita(idCita);
  }, []);

  return (
    <main className="flex w-screen justify-center">
      <div className="mb-20 flex w-[1150px] flex-col items-center justify-center gap-y-10">
        <div className="mt-28 flex items-center gap-10">
          <div
            className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-blue-primary text-4xl font-bold text-white"
            onClick={() => {
              router.push(
                `/dashboard/medico/historialClinico?DNI=${dniPaciente}`,
              );
            }}
          >
            <FaAngleLeft className="text-xl transition-transform duration-200 group-hover:scale-125" />
          </div>
          <h1 className="text-3xl font-bold text-blue-primary">
            DATOS Y TRATAMIENTO DE CITA MEDICA
          </h1>
        </div>

        {/* Datos de la cita */}
        <div className="flex w-[850px] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-blue-primary py-6">
          <h2 className="rounded-full bg-blue-primary px-20 text-2xl font-bold text-white">
            DATOS DE LA CITA MEDICA
          </h2>
          <p className="text-2xl font-bold text-blue-primary">
            Motivo de la cita :{" "}
            <span className="font-normal">
              {" "}
              {datosDiagnosticoCita?.CitaDatos?.Motivo}
            </span>
          </p>
          <div className="flex gap-x-10 text-blue-primary">
            <p className="text-lg font-bold">
              Fecha de la cita:{" "}
              <span className="font-normal">
                {datosDiagnosticoCita?.CitaDatos?.Dia}
              </span>
            </p>
            <p className="text-lg font-bold">
              Hora de la cita:{" "}
              <span className="font-normal">
                {datosDiagnosticoCita?.CitaDatos?.Hora}
              </span>
            </p>
          </div>
        </div>

        {/* Datos del medico a cargo*/}
        <DatosMedicoACargo
          historialClinico={datosDiagnosticoCita?.DatosDiagnostico}
        />
        {/* DIAGNOSTICO */}
        <Diagnostico
          historialClinico={datosDiagnosticoCita?.DatosDiagnostico}
        />
        {/* RECETA MEDICA */}
        <RecetaMedica
          historialClinico={datosDiagnosticoCita?.DatosDiagnostico}
        />
      </div>
    </main>
  );
};

export default DatosDiagnosticoCita;
