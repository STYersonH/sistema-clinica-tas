import React from "react";

const DatosMedicoACargo = ({ historialClinico }) => {
  return (
    <div className="flex w-[850px] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-yellow-primary py-6">
      <p className="text-2xl font-bold text-yellow-primary">
        Medico a cargo :{" "}
        <span className="font-normal">
          {" "}
          Dr. {historialClinico?.Medico?.NombresApellidos}
        </span>
      </p>
      <div className="flex gap-x-10 text-yellow-primary">
        <p className="text-lg font-bold">
          Nro Celular:{" "}
          <span className="font-normal">
            {historialClinico?.Medico?.Telefono}
          </span>
        </p>
        <p className="text-lg font-bold">
          Especialidad:{" "}
          <span className="font-normal">
            {historialClinico?.Medico?.Especialidad}
          </span>
        </p>
        {historialClinico?.Medico?.email !== null && (
          <p className="text-lg font-bold">
            Email:{" "}
            <span className="font-normal">
              {historialClinico?.Medico?.Email}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default DatosMedicoACargo;
