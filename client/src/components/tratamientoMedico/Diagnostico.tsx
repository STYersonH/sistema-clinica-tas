import React from "react";

const Diagnostico = ({ historialClinico }) => {
  console.log(historialClinico);
  return (
    <div className="flex w-[850px] flex-col items-center justify-center gap-3 rounded-3xl border-2 bg-yellow-primary py-6">
      <h2 className="rounded-full bg-white px-20 text-2xl font-bold text-yellow-primary">
        DIAGNOSTICO
      </h2>
      <p className="text-lg font-bold text-white">
        {historialClinico?.Diagnostico}
      </p>
      <div className="mt-5 flex w-full px-6">
        <p className="rounded-full border px-10 text-lg text-white">
          Fecha de diagnostico:{" "}
          <span className="font-bold">
            {historialClinico?.FechaDiagnostico?.slice(0, 10)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Diagnostico;
