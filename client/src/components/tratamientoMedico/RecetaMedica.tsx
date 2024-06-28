import React from "react";

const RecetaMedica = ({ historialClinico }) => {
  console.log(historialClinico);
  return (
    <div className="flex w-[850px] flex-col items-center justify-center gap-8 rounded-3xl border-2 border-yellow-primary px-10 pb-10 pt-6">
      <h2 className="rounded-full bg-yellow-primary px-20 text-2xl font-bold text-white">
        RECETA MEDICA
      </h2>

      {historialClinico?.Tratamientos?.map(
        (tratamiento: any, index: number) => {
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
                  {tratamiento?.Receta?.map((receta: any, index: number) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 gap-x-5 text-yellow-primary"
                      style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
                    >
                      <p className="ml-6 font-bold">
                        {receta.NombreMedicamento}
                      </p>
                      <p className="font-normal">{receta.Dosis}</p>
                      <p className="font-normal">{receta.Frecuencia}</p>
                      <p className="font-normal">{receta.Duracion}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
        },
      )}
    </div>
  );
};

export default RecetaMedica;
