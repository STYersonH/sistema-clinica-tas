"use client";

import React from "react";
import { getUsers } from "../apiRoutes/usuarios/usuariosApi";
import { postPaciente } from "../apiRoutes/pacientes/pacientesApi";
import { login } from "../apiRoutes/pacientes/pacientesApi";
import { updatePaciente } from "../apiRoutes/pacientes/pacientesApi";

const page = () => {
  const handleGetData = async () => {
    const res = await getUsers();
    console.log(res.data);
  };

  const handleSendDataPaciente = async () => {
    const data = {
      DNI: "12345678",
      nombres: "J J",
      apellido_paterno: "Matern",
      apellido_materno: "Patern",
      genero: "Masculino",
      direccion: "Calle 123",
      telefono: "123456789",
      ocupacion: "Estudiante",
      fechaNacimiento: "1999-01-01", // anio mes dia
    };

    const res = await postPaciente(data);

    console.log(res.status);

    if (res.status === 201) {
      console.log("Paciente registrado correctamente");
      console.log(res.data);
    } else {
      console.log("Error al registrar paciente");
      console.log(res.data);
    }
  };

  const handleLogin = async () => {
    const data = {
      username: "3805648488",
      password: "3805648488",
    };

    const res = await login(data);
    // 400 o 200
    if (res.status === 200) {
      console.log("Login correcto");
      console.log(res.data);
    } else {
      console.log("Error al loguearse");
      console.log(res.data);
    }
  };

  const handleUpdateDoctor = async () => {
    const data = {
      nombres: "Ju Ju",
      apellido_paterno: "Matern updated",
      apellido_materno: "Patern updated",
      genero: "Femenino",
      direccion: "Calle 123",
      telefono: "123456789",
      ocupacion: "Graduada",
      fechaNacimiento: "1999-01-01", // anio mes dia
    };

    const res = await updatePaciente("11", data);

    console.log(res.status);
    if (res.status === 200) {
      console.log("Paciente actualizado correctamente");
      console.log(res.data);
    } else {
      console.log("Error al actualizar paciente");
      console.log(res.data);
    }
  };

  return (
    <div className="flex gap-10">
      <button onClick={handleGetData}>Ver lista de usuarios</button>
      <button onClick={handleSendDataPaciente}>Enviar info paciente</button>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleUpdateDoctor}>Update doctor</button>
    </div>
  );
};

export default page;
