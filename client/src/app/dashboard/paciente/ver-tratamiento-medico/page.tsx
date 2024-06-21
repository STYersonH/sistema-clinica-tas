"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import {getHistorialUsuario} from "../../../apiRoutes/historialClinic/historialClinic.api";

const TratamientoPage = () => {

  const [historialClinico, setHistorialClinico] = useState<any>([])
  
  const fetchHistorialClinico = async () => {
    const response = await getHistorialUsuario("53415764")
    console.log(response.data.data)
    setHistorialClinico(response.data.data[0])
  }

  useEffect(() => {
    fetchHistorialClinico()
  }, [])

  const router = useRouter();

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
        <div className="flex w-[850px] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-yellow-primary py-6">
          <p className="text-2xl font-bold text-yellow-primary">
            {historialClinico.Medico?.NombresApellidos}
          </p>
          <div className="flex gap-x-10 text-yellow-primary">
            <p className="text-lg font-bold">
              Nro Celular: <span className="font-normal">{historialClinico.Medico?.Telefono}</span>
            </p>
            <p className="text-lg font-bold">
              Especialidad: <span className="font-normal">{historialClinico.Medico?.Especialidad}</span>
            </p>
          </div>
        </div>

        {/* DIAGNOSTICO */}
        <div className="flex w-[850px] flex-col items-center justify-center gap-3 rounded-3xl border-2 bg-yellow-primary py-6">
          <h2 className="rounded-full bg-white px-20 text-2xl font-bold text-yellow-primary">
            DIAGNOSTICO
          </h2>
          <p className="text-lg font-bold text-white">
            {historialClinico.Diagnostico}
          </p>
        </div>

        {/* RECETA MEDICA */}
        <div className="flex w-[850px] flex-col items-center justify-center gap-8 rounded-3xl border-2 border-yellow-primary px-10 pb-10 pt-6">
          <h2 className="rounded-full bg-yellow-primary px-20 text-2xl font-bold text-white">
            RECETA MEDICA
          </h2>

          {historialClinico.Tratamientos?.map((tratamiento:any, index:number) => {
            if (
              tratamiento.Tipo === "terapia" ||
              tratamiento.Tipo === "cirugia"
            ) {
              return (
                <div
                  key={index}
                  className="flex w-full flex-col gap-y-2 rounded-2xl border-2 border-yellow-primary p-5 text-yellow-primary"
                >
                  <div
                    className="inline-block w-auto rounded-full border border-yellow-primary px-5"
                    style={{ width: "fit-content" }}
                  >
                    {tratamiento.Tipo}
                  </div>
                  <p className="font-bold">{tratamiento.Descripcion}</p>
                </div>
              );
            } else {
              return (
                <div
                  key={index}
                  className="flex w-full flex-col gap-y-2 rounded-2xl border-2 border-yellow-primary p-5 text-yellow-primary"
                >
                  <div
                    className="inline-block w-auto rounded-full border border-yellow-primary px-5"
                    style={{ width: "fit-content" }}
                  >
                    {tratamiento.Tipo}
                  </div>
                  <div className="mt-3">
                    {tratamiento?.Receta?.map((receta:any, index:number) => (
                      <div
                        key={index}
                        className="grid grid-cols-4 gap-x-5 text-yellow-primary"
                        style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
                      >
                        <p className="ml-6 font-bold">{receta.NombreMedicamento}</p>
                        <p className="font-normal">{receta.Dosis}</p>
                        <p className="font-normal">{receta.Frecuencia}</p>
                        <p className="font-normal">{receta.Duracion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </main>
  );
};

export default TratamientoPage;
