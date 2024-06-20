"use client";

import { getInformacionUsuario } from "@/app/apiRoutes/authLogin/authLoginApi";
import { signOut, useSession } from "next-auth/react";

import React, { useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { useRouter, useSearchParams } from "next/navigation";
import {
  updatePaciente,
  postPaciente,
} from "@/app/apiRoutes/pacientes/pacientesApi";

const formSchema = z.object({
  nombres: z.string().min(1, { message: "Debe ingresar sus nombres" }).max(50),
  apellidos: z
    .string()
    .min(1, { message: "Debe ingresar sus apellidos" })
    .max(50),
  DNI: z
    .string()
    .length(8, { message: "El dni debe tener exactamente 8 numeros" }),
  genero: z.string().min(1, { message: "Debe elegir su genero" }),
  direccionVivienda: z
    .string()
    .min(1, { message: "Debe ingresar sus direccion de vivienda" })
    .max(50),
  diaBirthDate: z.string().min(1, { message: "elegir dia" }),
  mesBirthDate: z.string().min(1, { message: "elegir mes" }),
  anioBirthDate: z.string().min(1, { message: "elegir año" }),
  nroCelular: z.string().length(9, {
    message: "El numero de celular debe tener exactamente 8 numeros",
  }),

  email: z.string().optional(), // no obligatorio
  ocupacion: z.string().optional(), // no obligatorio
});

interface DatosPaciente {
  Nombres: string;
  Apellidos: string;
  Dni: string;
  Genero: string;
  Direccion: string;
  FechaNacimiento: string;
  Telefono: string;
  CorreoElectronico: string;
  Ocupacion: string;
}

// Assuming the original type of `user` is something like this:

// Extend the User type to include the ID property
type ExtendedUser = {
  ID?: string | null;
};

const FormCrearCuenta = () => {
  // obtener los datos de la session
  const { data: session, status } = useSession();

  const usuarioID = (session?.user as ExtendedUser)?.ID;
  const [datosPaciente, setDatosPaciente] = useState<DatosPaciente | null>(
    null,
  );

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

  // Nuevo useEffect para actualizar el formulario
  useEffect(() => {
    if (datosPaciente) {
      form.reset({
        nombres: datosPaciente?.Nombres || "",
        apellidos: datosPaciente?.Apellidos || "",
        DNI: datosPaciente?.Dni || "",
        genero: datosPaciente?.Genero || "",
        anioBirthDate: datosPaciente?.FechaNacimiento.slice(0, 4) || "",
        mesBirthDate: datosPaciente?.FechaNacimiento.slice(5, 7) || "",
        diaBirthDate: datosPaciente?.FechaNacimiento.slice(8, 10) || "",
        nroCelular: datosPaciente?.Telefono || "",
        email: datosPaciente?.CorreoElectronico || "",
        direccionVivienda: datosPaciente?.Direccion || "",
        ocupacion: datosPaciente?.Ocupacion || "",
      });
    }
  }, [datosPaciente]);

  const router = useRouter();
  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      DNI: "",
      genero: "",
      direccionVivienda: "",
      diaBirthDate: "",
      mesBirthDate: "",
      anioBirthDate: "",
      nroCelular: "",
      email: "",
      ocupacion: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // obtener apellido paterno y materno
    const apellidos = values.apellidos.split(" ");
    console.log(values);
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-yellow-500">
      <div
        className="flex gap-6"
        onClick={() => {
          router.push("/dashboard/paciente");
        }}
      >
        <div className="group mb-10 flex cursor-pointer items-center rounded-full bg-white px-10 py-5 text-4xl font-bold text-yellow-500">
          <FaAngleLeft className="transition-transform duration-200 group-hover:scale-125" />
        </div>
        <h2 className="mb-10 rounded-full bg-white px-10 py-5 text-4xl font-bold text-yellow-500">
          Modificacion de cuenta para paciente
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          //onSubmit={handleS}
          className="w-[1200px] space-y-8 rounded-3xl border-2 border-solid bg-white p-10"
        >
          {/* nombres y apellidos */}
          <div className="flex w-full gap-6">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="nombres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombres</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Escribir sus nombres"
                        {...field}
                        className="flex-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="apellidos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellidos</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Escribir sus apellidos"
                        {...field}
                        className="flex-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Nacimiento y Genero */}
          <div className="flex w-full gap-6">
            {/* Fecha de cumpleanios */}
            <div className="flex flex-1 flex-col gap-3 pt-1">
              <FormLabel>Fecha de nacimiento</FormLabel>
              <div className="flex w-full gap-2">
                {/* Year */}
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="anioBirthDate"
                    render={({ field }) => (
                      <FormItem>
                        {/*<FormLabel>Dia</FormLabel>*/}
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={datosPaciente?.FechaNacimiento.slice(
                                  0,
                                  4,
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from(
                              { length: 125 },
                              (_, i) => 2024 - i,
                            ).map((year) => (
                              <SelectItem key={`${year}`} value={`${year}`}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Month */}
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="mesBirthDate"
                    render={({ field }) => (
                      <FormItem>
                        {/*<FormLabel>Dia</FormLabel>*/}
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={datosPaciente?.FechaNacimiento.slice(
                                  5,
                                  7,
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="01">Enero</SelectItem>
                            <SelectItem value="02">Febrero</SelectItem>
                            <SelectItem value="03">Marzo</SelectItem>
                            <SelectItem value="04">Abril</SelectItem>
                            <SelectItem value="05">Mayo</SelectItem>
                            <SelectItem value="06">Junio</SelectItem>
                            <SelectItem value="07">Julio</SelectItem>
                            <SelectItem value="08">Agosto</SelectItem>
                            <SelectItem value="09">Septiembre</SelectItem>
                            <SelectItem value="10">Octubre</SelectItem>
                            <SelectItem value="11">Noviembre</SelectItem>
                            <SelectItem value="12">Diciembre</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Day */}
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="diaBirthDate"
                    render={({ field }) => (
                      <FormItem>
                        {/*<FormLabel>Dia</FormLabel>*/}
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={datosPaciente?.FechaNacimiento.slice(
                                  8,
                                  10,
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(
                              (day) => (
                                <SelectItem key={`${day}`} value={`${day}`}>
                                  {day}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* genero */}
            <div className="flex-1">
              <FormField
                control={form.control}
                name="genero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genero</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={datosPaciente?.Genero} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="femenino">Femenino</SelectItem>
                        <SelectItem value="masculino">Masculino</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* DNI, Telefono y correo electronico */}
          <div className="flex gap-6">
            <div className="flex flex-1 gap-3">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="DNI"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DNI</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Escribir su DNI"
                          {...field}
                          className="w-full"
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="nroCelular"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numero de celular</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Escibir su numero celular"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex-1">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electronico</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Escribir su correo electronico"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/*Nro de Liscencia y Especialidad*/}
          <div className="flex gap-6">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="direccionVivienda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Direccion de vivienda</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Escribir su direccion de vivienda"
                        {...field}
                        className=""
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1">
              <FormField
                control={form.control}
                name="ocupacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ocupacion</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Escribir su ocupacion"
                        {...field}
                        className=""
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex w-full justify-center gap-x-5 pt-5 text-center">
            <Button
              type="submit"
              className="rounded-3xl bg-green-500 px-16 py-7 font-bold hover:bg-green-600"
            >
              Modificar cuenta
            </Button>

            <Button className="rounded-3xl bg-red-500 px-16 py-7 font-bold hover:bg-red-600">
              Eliminar cuenta
            </Button>
            <Button className="rounded-3xl bg-stone-500 px-16 py-7 font-bold hover:bg-stone-600">
              Cambiar contraseña
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormCrearCuenta;
