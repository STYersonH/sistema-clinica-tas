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

import { obtenerInfoCitaPorDNIPaciente } from "@/app/apiRoutes/citas/citasApi";
import { getInformacionUsuario } from "@/app/apiRoutes/authLogin/authLoginApi";
import {getCitasCuliminadasPaciente} from "@/app/apiRoutes/citasCulminadas/citasCulminadas.api";

interface DatosPaciente {
  Dni: string | null | undefined;
  Nombres: string | null | undefined;
  Apellidos: string | null | undefined;
  Genero: string | null | undefined;
  Telefono: string | null | undefined;
  Direccion: string | null | undefined;
  FechaNacimiento: string | null | undefined;
}

// Ejemplo de componente que recibe datosPaciente como prop
interface PacienteProps {
  datosPaciente: DatosPaciente; // Paso 2: Tipar datosPaciente en su origen
}

type ExtendedUser = {
  ID?: string | null;
};

const PacientePage = () => {
  const { data: session, status } = useSession();
  const usuarioID = (session?.user as ExtendedUser)?.ID;

  const [dniPaciente, setDniPaciente] = useState("");
  const [datosPaciente, setDatosPaciente] = useState<DatosPaciente | null>(
    null,
  );

  const [citaExiste, setCitaExiste] = useState(false);
  const [datosCita, setDatosCita] = useState({}); // [datosCita, setDatosCita

  const [seguroExiste, setSeguroExiste] = useState(false);
  const [datosSeguro, setDatosSeguro] = useState({});
  const [datosAsegurado, setDatosAsegurado] = useState({});

  const [citaTerminada, setCitaTerminada] = useState(false);

  useEffect(() => {
    const fetchDatosPaciente = async () => {
      if (usuarioID) {
        // obtener los datos del paciente
        const res = await getInformacionUsuario(usuarioID);
        console.log(res.data.data);
        setDatosPaciente(res.data.data);
      }
    };

    fetchDatosPaciente();
  }, [usuarioID]);

  useEffect(() => {
    const DNIpaciente = datosPaciente?.Dni;
    setDniPaciente(DNIpaciente);
  }, [datosPaciente]);

  useEffect(() => {
    const fetchSeguroPaciente = async () => {
      if (dniPaciente) {
        try {
          // obtener los datos del seguro del paciente
          const res1 = await getInfoAsegurado(dniPaciente);
          console.log("res asegurado", res1.data);
          setDatosAsegurado(res1.data);
          const res2 = await getInfoSeguro(dniPaciente);
          console.log("res seguro", res2.data);
          setDatosSeguro(res2.data);
          setSeguroExiste(true);
        } catch (error) {
          console.log("Error al obtener los datos del asegurado", error);
        }
      }
    };

    fetchSeguroPaciente();
  }, [dniPaciente]);

  const fetchCitasCulminadas = async () => {
    const response = await getCitasCuliminadasPaciente(dniPaciente);
    console.log(response.data.data);
    if (response.data.data.length > 0) {
      setCitaTerminada(true);
    }
  }
  useEffect(() => {
    const obtenerCitaPaciente = async () => {
      if (dniPaciente) {
        try {
          // obtener los datos del paciente
          const res3 = await obtenerInfoCitaPorDNIPaciente(dniPaciente);
          console.log("res cita 3", res3.data);
          setDatosCita(res3.data);

          if (res3.data.data.length > 0) {
            setCitaExiste(true);
          }
        } catch (error) {
          console.log("Error al obtener los datos del asegurado", error);
        }
      }
    };
    fetchCitasCulminadas();
    obtenerCitaPaciente();
  }, [dniPaciente]);

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
              DNI: <span className="font-normal">{datosPaciente?.Dni}</span>
            </p>
            <p className="text-2xl font-bold text-yellow-600">
              Nombres:{" "}
              <span className="font-normal">{datosPaciente?.Nombres}</span>
            </p>
            <p className="text-2xl font-bold text-yellow-600">
              Apellidos:{" "}
              <span className="font-normal">{datosPaciente?.Apellidos}</span>
            </p>
            <p className="text-2xl font-bold text-yellow-600">
              Genero:{" "}
              <span className="font-normal">{datosPaciente?.Genero}</span>
            </p>
            <p className="text-2xl font-bold text-yellow-600">
              Telefono:{" "}
              <span className="font-normal">{datosPaciente?.Telefono}</span>
            </p>
            <p className="text-2xl font-bold text-yellow-600">
              Direccion:{" "}
              <span className="font-normal">{datosPaciente?.Direccion}</span>
            </p>
            <p className="text-2xl font-bold text-yellow-600">
              Fecha de nacimiento:{" "}
              <span className="font-normal">
                {datosPaciente?.FechaNacimiento?.slice(0, 10)}
              </span>
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
                <p className="font-bold">Seguro {datosSeguro.tipo_seguro}</p>
                <p className="">
                  Vence el {datosAsegurado?.FechaVencimiento?.slice(0, 10)}
                </p>
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
              href="/dashboard/paciente/modificar-cita"
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
