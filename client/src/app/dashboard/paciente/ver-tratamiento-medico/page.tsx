"use client";

import React from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const TratamientoPage = () => {
  const router = useRouter();

  const tratamiento = [
    {
      tipo: "terapia",
      descripcion: "Debes tomar sol por 30 minutos al dia",
    },
    {
      tipo: "cirugia",
      descripcion:
        "Se debe programar una operacion de emergencia para transplantar un riñon",
    },
    {
      tipo: "medicamento",
      receta: [
        {
          nombre: "Ibuprofeno",
          dosis: "1 tableta",
          frecuencia: "cada 8 horas",
          duracion: "7 dias",
        },
        {
          nombre: "Paracetamol",
          dosis: "1 tableta",
          frecuencia: "cada 6 horas",
          duracion: "5 dias",
        },
      ],
    },
  ];

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
            Dr: Hector Antonio Vargas Ampuero
          </p>
          <div className="flex gap-x-10 text-yellow-primary">
            <p className="text-lg font-bold">
              Nro Celular: <span className="font-normal">945633232</span>
            </p>
            <p className="text-lg font-bold">
              Especialidad: <span className="font-normal">Odontologia</span>
            </p>
          </div>
        </div>

        {/* DIAGNOSTICO */}
        <div className="flex w-[850px] flex-col items-center justify-center gap-3 rounded-3xl border-2 bg-yellow-primary py-6">
          <h2 className="rounded-full bg-white px-20 text-2xl font-bold text-yellow-primary">
            DIAGNOSTICO
          </h2>
          <p className="text-lg font-bold text-white">
            Se le diagnostico un serio cuadro de estres debido a mucha
            preocupacion
          </p>
        </div>

        {/* RECETA MEDICA */}
        <div className="flex w-[850px] flex-col items-center justify-center gap-8 rounded-3xl border-2 border-yellow-primary px-10 pb-10 pt-6">
          <h2 className="rounded-full bg-yellow-primary px-20 text-2xl font-bold text-white">
            RECETA MEDICA
          </h2>

          {tratamiento.map((tratamiento, index) => {
            if (
              tratamiento.tipo === "terapia" ||
              tratamiento.tipo === "cirugia"
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
                    {tratamiento.tipo}
                  </div>
                  <p className="font-bold">{tratamiento.descripcion}</p>
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
                    {tratamiento.tipo}
                  </div>
                  <div className="mt-3">
                    {tratamiento?.receta?.map((receta, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-4 gap-x-5 text-yellow-primary"
                        style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
                      >
                        <p className="ml-6 font-bold">{receta.nombre}</p>
                        <p className="font-normal">{receta.dosis}</p>
                        <p className="font-normal">{receta.frecuencia}</p>
                        <p className="font-normal">{receta.duracion}</p>
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
