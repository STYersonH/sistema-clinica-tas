"use client";

import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/Button";
import { cn } from "@/lib/utils";

import {
  getInfoAsegurado,
  getInfoSeguro,
} from "@/app/apiRoutes/asegurados/aseguradosApi";

const PacientePage = () => {
  const { data: session, status } = useSession();
  console.log("En paciente page, paciente", session);

  const datosPaciente = session?.user;
  const DNIpaciente = datosPaciente.Dni;
  console.log("DNI", DNIpaciente);

  // obtener fecha de nacimiento
  let fechaNacimiento = datosPaciente.FechaNacimiento;
  fechaNacimiento = fechaNacimiento.slice(0, 10);

  const [citaExiste, setCitaExiste] = useState(true);
  const [seguroExiste, setSeguroExiste] = useState(false);
  const [datosSeguro, setDatosSeguro] = useState({});
  const [datosAsegurado, setDatosAsegurado] = useState({});
  const [citaTerminada, setCitaTerminada] = useState(true);

  useEffect(() => {
    const fetchSeguroPaciente = async () => {
      if (DNIpaciente) {
        try {
          // obtener los datos del paciente
          const res1 = await getInfoAsegurado(DNIpaciente);
          console.log(res1.data);
          setDatosAsegurado(res1.data.data);
          const res2 = await getInfoSeguro(DNIpaciente);
          setDatosSeguro(res2.data.data);
          setSeguroExiste(true);
        } catch (error) {
          console.log("Error al obtener los datos del asegurado", error);
        }
      }
    };

    fetchSeguroPaciente();
  }, []);

  const router = useRouter();
  return (
    <main className="flex h-screen justify-center">
      <div className="flex h-screen w-[1150px] items-center justify-between gap-x-20">
        {/*Informacion del usuario*/}
        <div className="flex w-[550px] flex-col items-center gap-y-10 rounded-2xl border border-gris p-10">
          <Image
            src="/paciente-icon.svg"
            alt="inicial img"
            width={300}
            height={300}
          />
          <div className="flex flex-col items-center rounded-2xl border border-gris p-8">
            <p className="text-2xl font-bold text-yellow-600">
              DNI: <span className="font-normal">{datosPaciente.Dni}</span>
            </p>
            <p className="text-2xl font-bold text-yellow-600">
              Nombres:{" "}
              <span className="font-normal">{datosPaciente.Nombres}</span>
            </p>
            <p className="text-2xl font-bold text-yellow-600">
              Apellidos:{" "}
              <span className="font-normal">{datosPaciente.Apellidos}</span>
            </p>
            <p className="text-2xl font-bold text-yellow-600">
              Genero:{" "}
              <span className="font-normal">{datosPaciente.Genero}</span>
            </p>
            <p className="text-2xl font-bold text-yellow-600">
              Telefono:{" "}
              <span className="font-normal">{datosPaciente.Telefono}</span>
            </p>
            <p className="text-2xl font-bold text-yellow-600">
              Direccion:{" "}
              <span className="font-normal">{datosPaciente.Direccion}</span>
            </p>
            <p className="text-2xl font-bold text-yellow-600">
              Fecha de nacimiento:{" "}
              <span className="font-normal">{fechaNacimiento}</span>
            </p>
          </div>
        </div>
        {/*Botones de accion*/}

        <div
          className={cn(
            "flex h-[720px] flex-col items-center",
            seguroExiste ? "justify-start" : "justify-center",
          )}
        >
          {seguroExiste && (
            <div className="mb-10 flex w-[500px] flex-col items-center justify-center rounded-2xl border border-gris p-10 text-yellow-primary">
              <h2 className="text-2xl font-bold">USTED ESTA ASEGURADO</h2>
              <div className="mt-3 flex gap-x-5">
                <p className="font-bold">Seguro estandar</p>
                <p className="">2 anios</p>
              </div>
            </div>
          )}

          {!citaExiste && !citaTerminada && (
            <Button
              href="/dashboard/paciente/reservar-cita"
              className="w-[500px] rounded-xl bg-stone-300 text-2xl text-yellow-primary hover:bg-stone-400 hover:text-white"
            >
              RESERVAR CITA
            </Button>
          )}
          {citaExiste && !citaTerminada && (
            <Button
              href="/dashboard/paciente/citas"
              color="yellow"
              className="w-[500px] rounded-xl text-2xl"
            >
              MODIFICAR CITA
            </Button>
          )}

          {citaTerminada && (
            <Button
              href="/dashboard/paciente/ver-tratamiento-medico"
              className="w-[500px] rounded-xl bg-stone-300 text-2xl text-yellow-primary hover:bg-stone-400 hover:text-white"
            >
              VER TRATAMIENTO MEDICO
            </Button>
          )}

          {!seguroExiste && (
            <Button
              href="/dashboard/paciente/asegurar"
              className="w-[500px] rounded-xl bg-stone-300 text-2xl text-yellow-primary hover:bg-stone-400 hover:text-white"
            >
              SOLICITAR SEGURO MEDICO
            </Button>
          )}
        </div>
      </div>
    </main>
  );
};

export default PacientePage;
