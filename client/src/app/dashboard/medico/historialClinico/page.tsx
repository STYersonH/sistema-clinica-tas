"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { CiSearch } from "react-icons/ci";
import { FaAngleLeft } from "react-icons/fa6";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { infoPacientePorDNI } from "@/app/apiRoutes/pacientes/pacientesApi";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  rastreadorPaciente: z.string(),
});

type ExtendedUser = {
  Dni?: string | null;
};

const HistorialClinico = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const dniPacienteParam = searchParams.get("DNI");
  console.log("DNI del paciente: ", dniPacienteParam);

  const [actualPaciente, setActualPaciente] = useState(null);
  const [DNI, setDNI] = useState(dniPacienteParam);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rastreadorPaciente: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values.rastreadorPaciente);
      const res = await infoPacientePorDNI(values.rastreadorPaciente);
      const datos = res.data.data;
      console.log(datos);

      // Obteniendo solo la fecha de nacimiento
      var nacimiento = datos.FechaNacimiento;
      nacimiento = nacimiento?.slice(0, 10);

      setActualPaciente({ ...res.data.data, fechaNacimiento: nacimiento });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.response.data.error,
        description: "No existe el paciente con ese DNI o nombre.",
      });
    }
  }

  useEffect(() => {
    const fetchHistorialClinico = async (DNI: string) => {
      if (DNI !== null) {
        try {
          const res = await infoPacientePorDNI(DNI);
          const datos = res.data.data;

          // Obteniendo solo la fecha de nacimiento
          var nacimiento = datos.FechaNacimiento;
          nacimiento = nacimiento?.slice(0, 10);

          setActualPaciente({ ...res.data.data, fechaNacimiento: nacimiento });
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: error.response.data.error,
            description: "No existe el paciente con ese DNI o nombre.",
          });
        }
      }
    };

    fetchHistorialClinico(DNI);
  }, [DNI]);

  return (
    <main className="flex h-screen justify-center">
      <div className="flex h-screen w-[1150px] flex-col items-center gap-x-20">
        {/* TITULO */}
        <div className="mt-28 flex items-center gap-10">
          <div
            className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-blue-primary text-4xl font-bold text-white"
            onClick={() => {
              router.push(`/dashboard/medico`);
              router.refresh();
            }}
          >
            <FaAngleLeft className="text-xl transition-transform duration-200 group-hover:scale-125" />
          </div>
          <h1 className="text-3xl font-bold text-blue-primary">
            HISTORIAL CLINICO
          </h1>
        </div>

        {/* BARRA DE BUSQUEDA */}
        {DNI == null && (
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-[800px] space-y-8 rounded-3xl border-2 border-solid bg-white p-10 pb-0"
              >
                <div className="flex w-full items-center justify-between rounded-full border border-gris p-2">
                  <div className="flex">
                    <CiSearch className="h-10 w-10 text-gris" />
                    <FormField
                      control={form.control}
                      name="rastreadorPaciente"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Escribir el DNI del paciente"
                              {...field}
                              className="flex-full h-10 w-[450px] border-0 focus-visible:border-white focus-visible:ring-0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="my-0 rounded-3xl bg-blue-primary px-16 py-2 font-bold hover:bg-blue-dark"
                  >
                    Buscar
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {actualPaciente && (
          <div className="mt-10 flex w-full gap-x-10">
            {/*DATOS Y SI TIENE SEGURO*/}
            <div className="flex w-[450px] flex-col gap-10">
              {/*DATOS PERSONALES*/}

              <div className="flex w-full flex-col items-center gap-y-10 rounded-2xl border border-gris p-10 px-20">
                {/*Nombres e Icono*/}
                <div className="flex items-center gap-5">
                  <div className="rounded-full border border-gris">
                    <Image
                      src="/paciente-icon.svg"
                      alt="paciente"
                      width={100}
                      height={100}
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xl font-bold">
                      {actualPaciente.Nombres}
                    </p>
                    <p className="text-lg">{actualPaciente.Apellidos}</p>
                  </div>
                </div>
                {/*Demas datos personales*/}
                <div className="flex flex-col gap-7">
                  <div className="flex w-full gap-10">
                    <div className="w-[60%]">
                      <p className="text-gray-500">Fecha de nacimiento</p>
                      <p className="text-xl">
                        {actualPaciente.fechaNacimiento}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">DNI</p>
                      <p className="text-xl">{actualPaciente.DNI}</p>
                    </div>
                  </div>
                  <div className="flex w-full gap-10">
                    <div className="w-[60%]">
                      <p className="text-gray-500">Nro de celular</p>
                      <p className="text-xl">{actualPaciente.NroCelular}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Genero</p>
                      <p className="text-xl">{actualPaciente.Genero}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500">Direccion de vivienda</p>
                    <p className="text-xl">
                      {actualPaciente.DireccionVivienda}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Ocupacion</p>
                    {actualPaciente.Ocupacion ? (
                      <p className="text-xl">Trabajador social</p>
                    ) : (
                      <p className="text-xl text-red-800">
                        Aun no se actualizo esta informacion
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/*INFORMACION DE SEGURO*/}
              {actualPaciente.TieneSeguro !== null ? (
                <div className="flex justify-center rounded-2xl border border-gris py-3 text-2xl font-bold text-blue-primary">
                  Tiene seguro {actualPaciente.TipoSeguro}
                </div>
              ) : (
                <div className="flex justify-center rounded-2xl border border-gris py-3 text-2xl font-bold text-red-600">
                  No tiene seguro
                </div>
              )}
            </div>

            {/*HISTORIAL CLINICO*/}
            <div className="flex grow flex-col rounded-2xl border border-gris p-10">
              <h1 className="mb-5 w-full rounded-xl border-2 border-blue-primary py-2 text-center text-2xl font-bold text-blue-primary">
                HISTORIAL CLINICO DEL PACIENTE
              </h1>
              {/*un diagnostico del paciente*/}
              {actualPaciente.Historiales === null && (
                <div className="flex h-[60%] flex-col items-center justify-center text-blue-primary">
                  <Image
                    src="/EmptyState.svg"
                    alt="empty state"
                    width={300}
                    height={300}
                  />
                  <p className="absolute bottom-[350px] text-xl">
                    El paciente aun no tiene historial
                  </p>
                </div>
              )}
              {actualPaciente.Historiales?.map((historial: any) => (
                <div
                  className="grid cursor-pointer grid-cols-3 rounded-lg p-4 transition-all duration-200 ease-in-out hover:bg-stone-300"
                  key={actualPaciente?.DNI}
                  onClick={() => {
                    router.push(
                      `/dashboard/medico/historialClinico/datos-diagnostico-cita?IdCita=${historial.IdCita}&DNIpaciente=${actualPaciente.DNI}`,
                    );
                  }}
                >
                  <div className="flex flex-col">
                    <p className="text-md text-gray-500">Dia</p>
                    <p className="text-xl">{historial.Dia.slice(0, 10)}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-md text-gray-500">Hora</p>
                    <p className="text-xl">{historial.Hora.slice(1)}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-md text-gray-500">Especialista</p>
                    <p className="text-xl">
                      Dr. {historial.NombreDoctor} {historial.ApellidoDoctor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default HistorialClinico;
