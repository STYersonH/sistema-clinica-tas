"use client";

import React from "react";
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
import { postPaciente } from "../../apiRoutes/pacientes/pacientesApi";

const formSchema = z.object({
  nombres: z.string().min(2).max(50),
  apellidos: z.string().min(2).max(50),
  DNI: z.string().min(8).max(8),
  genero: z.string().optional(),
  direccionVivienda: z.string().min(2).max(50),
  diaBirthDate: z.string().optional(),
  mesBirthDate: z.string().optional(),
  anioBirthDate: z.string().optional(),
  nroCelular: z.string().min(9).max(9),
  email: z.string().email(), // no obligatorio
  ocupacion: z.string().optional(),
});

const FormCrearCuenta = () => {
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

    // obtener fecha de nacimiento
    const fechaNacimiento = `${values.anioBirthDate}-${values.mesBirthDate}-${values.diaBirthDate}`;

    const data = {
      DNI: values.DNI,
      nombres: values.nombres,
      apellido_paterno: apellidos[0],
      apellido_materno: apellidos[1],
      genero: values.genero,
      direccion: values.direccionVivienda,
      telefono: values.nroCelular,
      ocupacion: values.ocupacion,
      fechaNacimiento: fechaNacimiento, // anio mes dia
    };

    const res = await postPaciente(data);

    console.log(res.status);

    if (res.status === 201) {
      //console.log(res.data);
      toast({
        title: "Paciente creado correctamente",
        description: `Su usuario y contraseña son "${values.DNI}".`, //TODO en cuanto se pueda actualizar al paciente, colocar eso en este mensaje
      });
    } else {
      toast({
        variant: "destructive",
        title: "Se produjo un error al crear el paciente",
        description: "Intente nuevamente.",
      });
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-yellow-500">
      <div
        className="flex gap-6"
        onClick={() => {
          router.push("/");
        }}
      >
        <div className="group mb-10 flex cursor-pointer items-center rounded-full bg-white px-10 py-5 text-4xl font-bold text-yellow-500">
          <FaAngleLeft className="transition-transform duration-200 group-hover:scale-125" />
        </div>
        <h2 className="mb-10 rounded-full bg-white px-10 py-5 text-4xl font-bold text-yellow-500">
          Creacion de cuenta para paciente
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
                              <SelectValue placeholder="año" />
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
                              <SelectValue placeholder="mes" />
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
                              <SelectValue placeholder="dia" />
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
                          <SelectValue placeholder="Seleccionar su genero" />
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

          <div className="w-full pt-5 text-center">
            <Button
              type="submit"
              className="rounded-3xl bg-green-500 px-16 py-7 font-bold hover:bg-green-600"
            >
              Crear cuenta
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormCrearCuenta;
