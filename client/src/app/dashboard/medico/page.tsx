"use client";

import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/Button";
import { cn } from "@/lib/utils";
import { tree } from "next/dist/build/templates/app-page";
import { getCitasProgramadasDoctor } from "@/app/apiRoutes/citasPendientes/citasPendientes.api";

const MedicoPage = () => {
  const [citasPendientes, setCitasPendientes] = useState([]);
  const [citasExisten, setCitasExisten] = useState(true);
  const [licMedico, setLicMedico] = useState("");

  const { data: session, status } = useSession();
  const datosMedico = session?.user;

  useEffect(() => {
    const licenciaMedico = datosMedico?.NroLiscencia;
    setLicMedico(licenciaMedico);
  }, [datosMedico]);

  useEffect(() => {
    const fetchCitasPendientes = async () => {
      const response = await getCitasProgramadasDoctor(licMedico);
      setCitasPendientes(response.data.data);
      console.log(response.data.data);
    };

    fetchCitasPendientes();
  }, [licMedico]);

  const router = useRouter();
  return (
    <main className="flex h-screen justify-center">
      <div className="flex h-screen w-[1150px] items-center justify-between gap-x-20">
        {/*Informacion del usuario*/}
        <div className="flex w-[550px] flex-col items-center gap-y-10 rounded-2xl border border-gris p-10">
          <Image
            src="/medico-icon.svg"
            alt="inicial img"
            width={300}
            height={300}
          />
          <div className="flex w-[450px] flex-col items-center rounded-2xl border border-gris p-8">
            <p className="text-2xl font-bold text-blue-primary">
              DNI: <span className="font-normal">77777777</span>
            </p>
            <p className="text-2xl font-bold text-blue-primary">
              Liscencia: <span className="font-normal">77717717717</span>
            </p>
            <p className="text-2xl font-bold text-blue-primary">
              Nombres: <span className="font-normal">Mat Rony</span>
            </p>
            <p className="text-2xl font-bold text-blue-primary">
              Apellidos: <span className="font-normal">Omeda Salcedo</span>
            </p>
            <p className="my-5 rounded-full bg-blue-primary px-10 py-1 text-2xl font-bold text-white">
              Medicina general
            </p>
          </div>
        </div>

        {/* Citas pendientes */}
        <div className="relative flex h-[696px] w-[550px] flex-col items-center gap-y-10 rounded-2xl border border-gris p-10">
          {citasPendientes.length != 0 ? (
            <div className="w-full">
              <h1 className="mb-5 w-full rounded-xl bg-blue-primary py-2 text-center text-2xl font-bold text-white">
                CITAS PENDIENTES
              </h1>
              <div className="flex flex-col gap-y-4">
                {citasPendientes.map((cita: any) => (
                  <div
                    key={cita.ID}
                    className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-gris px-10 py-3 text-blue-primary transition-all hover:bg-stone-300"
                    onClick={() =>
                      router.push(
                        `/dashboard/medico/tratamiento?citaID=${cita.ID}&dniPaciente=${cita.DniPaciente}&liscenciaMedico=${cita.LicenciaDoctor}`,
                      )
                    }
                  >
                    <p className="text-lg font-bold text-blue-primary">
                      Paciente:{" "}
                      <span className="font-normal">
                        {cita.Paciente.Nombres} {cita.Paciente.Apellido_paterno}{" "}
                        {cita.Paciente.Apellido_materno}
                      </span>
                    </p>
                    <div className="w-full rounded-xl bg-blue-primary px-6 py-2 text-center text-white">
                      {cita.Motivo}
                    </div>
                    <p className="font-bold">
                      Especialidad:{" "}
                      <span className="font-normal">
                        {cita.Especialidad.Nombre}
                      </span>
                    </p>
                    <div className="flex gap-5">
                      <p className="font-bold">
                        Fecha:{" "}
                        <span className="font-normal">
                          {cita.Fecha.substring(0, 10)}
                        </span>{" "}
                      </p>
                      <p className="font-bold">
                        Hora:{" "}
                        <span className="font-normal">
                          {cita.Hora.substring(11, 16)}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-[80%] flex-col items-center justify-center text-blue-primary">
              <Image
                src="/EmptyState.svg"
                alt="empty state"
                width={300}
                height={300}
              />
              <p className="absolute bottom-[290px] text-xl">
                No hay citas pendientes
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MedicoPage;
