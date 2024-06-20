"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/Button";
import { cn } from "@/lib/utils";

const PacientePage = () => {
  const [citaExiste, setCitaExiste] = useState(true);
  const [seguroExiste, setSeguroExiste] = useState(true);
  const [citaTerminada, setCitaTerminada] = useState(true);

  const router = useRouter();
  return (
    <main className="flex h-screen justify-center">
      <div className="flex h-screen w-[1150px] items-center justify-between gap-x-20">
        {/*Informacion del usuario*/}
        <div className="border-gris flex w-[550px] flex-col items-center gap-y-10 rounded-2xl border p-10">
          <Image
            src="/paciente-icon.svg"
            alt="inicial img"
            width={300}
            height={300}
          />
          <div className="border-gris flex flex-col items-center rounded-2xl border p-8">
            <p className="text-2xl font-bold text-yellow-600">
              DNI: <span className="font-normal">77777777</span>
            </p>
            <p className="text-2xl font-bold text-yellow-600">
              Nombres: <span className="font-normal">Mat Rony</span>
            </p>
            <p className="text-2xl font-bold text-yellow-600">
              Apellidos: <span className="font-normal">Omeda Salcedo</span>
            </p>
            <p className="text-2xl font-bold text-yellow-600">
              Genero: <span className="font-normal">Masculino</span>
            </p>
            <p className="text-2xl font-bold text-yellow-600">
              Telefono: <span className="font-normal">934223234</span>
            </p>
            <p className="text-2xl font-bold text-yellow-600">
              Direccion: <span className="font-normal">Los alamos 11 - A</span>
            </p>
            <p className="text-2xl font-bold text-yellow-600">
              Fecha de nacimiento:{" "}
              <span className="font-normal">20/01/1995</span>
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
            <div className="text-yellow-primary border-gris mb-10 flex w-[500px] flex-col items-center justify-center rounded-2xl border p-10">
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
              className="text-yellow-primary w-[500px] rounded-xl bg-stone-300 text-2xl hover:bg-stone-400 hover:text-white"
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
              className="text-yellow-primary w-[500px] rounded-xl bg-stone-300 text-2xl hover:bg-stone-400 hover:text-white"
            >
              VER TRATAMIENTO MEDICO
            </Button>
          )}

          {!seguroExiste && (
            <Button
              href="/dashboard/paciente/asegurar"
              className="text-yellow-primary w-[500px] rounded-xl bg-stone-300 text-2xl hover:bg-stone-400 hover:text-white"
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
