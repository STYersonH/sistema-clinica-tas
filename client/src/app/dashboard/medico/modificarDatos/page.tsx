"use client";

import { getInformacionUsuario } from "@/app/apiRoutes/authLogin/authLoginApi";
import { getEspecialidades } from "@/app/apiRoutes/especialidades/especialidadesApi";

import React, { useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useToast } from "@/components/ui/use-toast";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { postMedico, updateMedico } from "@/app/apiRoutes/medicos/medicosApi";

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
  numeroLiscencia: z.string().length(10, {
    message: "El numero de liscencia debe tener exactamente 10 caracteres",
  }),
  diaBirthDate: z.string().min(1, { message: "elegir dia" }),
  mesBirthDate: z.string().min(1, { message: "elegir mes" }),
  anioBirthDate: z.string().min(1, { message: "elegir año" }),
  nroCelular: z.string().length(9, {
    message: "El numero de celular debe tener exactamente 8 numeros",
  }),
  email: z.string().email({ message: "Debe ingresar un correo valido" }),
  especialidad: z.string().min(1, { message: "Debe elegir su especialidad" }),
  direccionVivienda: z
    .string()
    .min(1, { message: "Debe ingresar sus direccion de vivienda" })
    .max(50),
});

const FormModificarCuentaMedico = () => {
  const searchParams = useSearchParams(); // usar params del URL
  let usuarioID = searchParams.get("id");

  const [datosMedico, setDatosMedico] = useState({});
  const [especialidades, setEspecialidades] = useState([]);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const ObtenerEspecialidades = async () => {
      // obtener los tipos de seguro
      const res = await getEspecialidades();
      setEspecialidades(res.data.data);
      console.log(res.data.data);
    };

    ObtenerEspecialidades();
  }, []);

  useEffect(() => {
    const fetchDatosMedico = async () => {
      if (usuarioID) {
        // obtener los datos del paciente
        const res = await getInformacionUsuario(usuarioID);
        console.log(res.data.data);
        setDatosMedico(res.data.data);
      }
    };

    fetchDatosMedico();
  }, [usuarioID]);

  // Nuevo useEffect para actualizar el formulario
  useEffect(() => {
    if (datosMedico) {
      form.reset({
        nombres: datosMedico?.Nombres || "",
        apellidos: datosMedico?.Apellidos || "",
        DNI: datosMedico?.Dni || "",
        genero: datosMedico?.Genero || "",
        numeroLiscencia: datosMedico?.NroLiscencia || "",
        anioBirthDate: datosMedico?.FechaNacimiento?.slice(0, 4) || "",
        mesBirthDate: datosMedico?.FechaNacimiento?.slice(5, 7) || "",
        diaBirthDate: datosMedico?.FechaNacimiento?.slice(8, 10) || "",
        nroCelular: datosMedico?.Telefono || "",
        email: datosMedico?.CorreoElectronico || "",
        especialidad: datosMedico?.Especialidad || "",
        direccionVivienda: datosMedico?.Direccion || "",
      });
    }
  }, [datosMedico]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      DNI: "",
      genero: "",
      numeroLiscencia: "",
      diaBirthDate: "",
      mesBirthDate: "",
      anioBirthDate: "",
      nroCelular: "",
      email: "",
      especialidad: "",
      direccionVivienda: "",
    },
  });

  //TODO: Obtener las especialidades para mostrar en el formulario

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // obtener apellido paterno y materno
    const apellidos = values.apellidos.split(" ");

    // obtener fecha de nacimiento
    const fechaNacimiento = `${values.anioBirthDate}-${values.mesBirthDate}-${values.diaBirthDate}`;

    const data = {
      DNI: values.DNI,
      numero_liscencia: values.numeroLiscencia,
      nombres: values.nombres,
      apellido_paterno: apellidos[0],
      apellido_materno: apellidos[1],
      genero: values.genero,
      email: values.email,
      direccion: values.direccionVivienda,
      telefono: values.nroCelular,
      fechaNacimiento: fechaNacimiento, // anio mes dia
      especialidad_id: values.especialidad,
    };

    console.log("datos antes de enviar", data);

    try {
      const res = await updateMedico(datosMedico?.IdDoctor, data);
      console.log(res.status);

      if (res.status === 200) {
        //console.log(res.data);
        toast({
          title: "Medico actualizado correctamente",
          description: `Ha actualizado su informacion correctamente"`, //TODO en cuanto se pueda actualizar al medico, actualizar este mensaje
        });
        router.push("/dashboard/medico");
      } else {
        toast({
          variant: "destructive",
          title:
            "Se produjo un error al intentar modificar los datos del medico",
          description: "Intente nuevamente.",
        });
      }
    } catch (err: any) {
      console.log("Hubo un error al modificar los datos del medico", err);
      toast({
        variant: "destructive",
        title: "Se produjo un error al intentar modificar los datos del medico",
        description: "Intente nuevamente.",
      });
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-blue-primary">
      <div
        className="flex gap-6"
        onClick={() => {
          router.push("/");
        }}
      >
        <div className="group mb-10 flex cursor-pointer items-center rounded-full bg-white px-10 py-5 text-4xl font-bold text-blue-primary">
          <FaAngleLeft className="transition-transform duration-200 group-hover:scale-125" />
        </div>
        <h2 className="mb-10 rounded-full bg-white px-10 py-5 text-4xl font-bold text-blue-primary">
          Modificacion de cuenta para medico
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
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
                                placeholder={datosMedico?.FechaNacimiento?.slice(
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
                                placeholder={datosMedico?.FechaNacimiento?.slice(
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
                                placeholder={datosMedico?.FechaNacimiento?.slice(
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
                          <SelectValue placeholder={datosMedico?.Genero} />
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

          {/*Direccion de vivienda, Nro de Liscencia y Especialidad*/}
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

            <div className="flex flex-1 gap-4">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="numeroLiscencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numero de liscencia</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="numero de liscencia"
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
                  name="especialidad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Especialidad</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={datosMedico?.Especialidad}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {especialidades.map((especialidad) => (
                            <SelectItem
                              key={especialidad.ID}
                              value={especialidad.ID.toString()}
                            >
                              {especialidad.Nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex w-full justify-center gap-x-5 pt-5 text-center">
            <Button
              type="submit"
              className="rounded-3xl bg-green-500 px-16 py-7 font-bold hover:bg-green-600"
            >
              Modificar cuenta
            </Button>

            {/*
            <Button className="rounded-3xl bg-red-500 px-16 py-7 font-bold hover:bg-red-600">
                          Eliminar cuenta
                        </Button>
            */}

            <Button className="rounded-3xl bg-stone-500 px-16 py-7 font-bold hover:bg-stone-600">
              Cambiar contraseña
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormModificarCuentaMedico;
