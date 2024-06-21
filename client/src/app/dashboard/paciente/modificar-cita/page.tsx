"use client";

import { getEspecialidades } from "@/app/apiRoutes/especialidades/especialidadesApi";
import {
  obtenerInfoCitaPorDNIPaciente,
  putCita,
} from "@/app/apiRoutes/citas/citasApi";
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
import { Calendar } from "@/components/ui/calendar";

import { format, set } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  especialidad: z.string(),
  motivoConsulta: z
    .string()
    .min(1, { message: "escribir motivo de la consulta" }),
  // fecha obligatoria
  fechaCita: z.date().optional(),
  horaCita: z.string().min(1, { message: "elegir hora" }),
  minutoCita: z.string().min(1, { message: "elegir minutos" }),
});

type ExtendedUser = {
  Dni?: string | null;
};

interface Especialidad {
  Nombre: string;
  // include other properties as needed
}

const FormCrearCuenta = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [datosCita, setDatosCita] = useState({});
  const [DNI, setDNI] = useState<string | null | undefined>("");

  // obtener el id del paciente desde los datos de sesion
  const { data: session, status } = useSession();
  const datosPaciente = session?.user;
  //const DNI = (session?.user as ExtendedUser)?.Dni;

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      especialidad: "",
      fechaCita: new Date(),
      horaCita: "",
      minutoCita: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    let date = new Date(values.fechaCita);
    const fechaConFormato = date.toISOString().split("T")[0];
    console.log("llenando datos con el estado: ", datosCita);

    const data = {
      DNIpaciente: DNI,
      especialidadId: parseInt(datosCita.idEspecialidad),
      motivo: values.motivoConsulta,
      fecha: fechaConFormato ? fechaConFormato : datosCita.Original,
      hora: values.horaCita,
      minuto: values.minutoCita,
    };
    console.log("datos para enviar", data);

    try {
      const res = await putCita(datosCita.ID, data);
      console.log(res.status);
      toast({
        title: "Se actualizo la cita correctamente",
        description: `Tiene una cita el ${fechaConFormato} a las ${values.horaCita}:${values.minutoCita}`,
      });
      router.push("/dashboard/paciente/");
    } catch (err: any) {
      console.log("Hubo un error al actualizar la cita", err);
      toast({
        variant: "destructive",
        title: "Se produjo un error al intentar actualizar la cita",
        description: "Intente nuevamente.",
      });
    }
  }

  useEffect(() => {
    const DNIpaciente = datosPaciente?.Dni;
    console.log("DNI", DNIpaciente);
    setDNI(DNIpaciente);
  }, [datosPaciente]);

  useEffect(() => {
    const ObtenerEspecialidades = async () => {
      // obtener los tipos de seguro
      const res = await getEspecialidades();
      setEspecialidades(res.data.data);
    };
    ObtenerEspecialidades();
  }, []);

  useEffect(() => {
    const ObtenerDatosCita = async () => {
      const resDatosCita = await obtenerInfoCitaPorDNIPaciente(DNI);
      const datosDeCita = resDatosCita.data.data[0];
      console.log("res datos cita", resDatosCita.data.data[0]);

      const datosCita = {
        ID: datosDeCita?.ID,
        especialidad: datosDeCita?.EspecialidadId,
        motivoConsulta: datosDeCita?.Motivo,
        fechaCita: datosDeCita?.Fecha?.slice(0, 10),
        horaCita: datosDeCita?.Hora?.slice(11, 13),
        minutoCita: datosDeCita?.Hora?.slice(14, 16),
      };

      console.log(datosCita);

      const index = parseInt(datosCita.especialidad) - 1;
      const especialidad =
        index >= 0 && index < especialidades.length
          ? especialidades[index].Nombre
          : "Default Name";

      const date = new Date(datosCita.fechaCita + "T00:00:00");

      // 2. Ajustar la fecha a la zona horaria de Perú (GMT-0500)
      const peruTimeZone = "America/Lima";
      const options = {
        timeZone: peruTimeZone,
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZoneName: "short",
      };

      const formatter = new Intl.DateTimeFormat("en-US", options);
      const formattedDate = formatter?.format(date);

      const nuevosDatos = {
        ...datosCita,
        idEspecialidad: datosCita.especialidad,
        fechaOriginal: datosCita.fechaCita,
        especialidad,
        fechaCita: formattedDate,
      };
      setDatosCita(nuevosDatos);
    };

    ObtenerDatosCita();
  }, [especialidades, DNI]);

  useEffect(() => {
    if (datosCita) {
      form.reset({
        especialidad: datosCita.especialidad,
        motivoConsulta: datosCita.motivoConsulta,
        fechaCita: datosCita.fechaCita,
        horaCita: datosCita.horaCita,
        minutoCita: datosCita.minutoCita,
      });
    }
  }, [datosCita]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-yellow-primary">
      <div
        className="flex gap-6"
        onClick={() => {
          router.push("/dashboard/paciente/");
        }}
      >
        <div className="group mb-10 flex cursor-pointer items-center rounded-full bg-white px-10 py-5 text-4xl font-bold text-yellow-primary">
          <FaAngleLeft className="transition-transform duration-200 group-hover:scale-125" />
        </div>
        <h2 className="mb-10 rounded-full bg-white px-10 py-5 text-4xl font-bold text-yellow-primary">
          Modificar cita medica
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[800px] space-y-8 rounded-3xl border-2 border-solid bg-white p-10"
        >
          {/* Especialidad*/}
          <div className="mx-auto w-[400px]">
            <FormField
              control={form.control}
              name="especialidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especialidad</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                      // no modificar
                      disabled
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={datosCita?.especialidad} />
                      </SelectTrigger>
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Motivo */}
          <div>
            <FormField
              control={form.control}
              name="motivoConsulta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo de la consulta</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escribir el motivo de por que necesita una consulta"
                      id="message-2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Fecha y Hora */}
          <div className="flex">
            {/* fecha de nacimiento */}
            <div className="mt-1 flex-1">
              <FormField
                control={form.control}
                name="fechaCita"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel>Fecha de la cita</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            size={"lg"}
                            className={cn(
                              "mt-2 w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Seleccione un dia</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              {/* hora de la cita */}
              <div className="flex flex-1 flex-col gap-3 pt-1">
                <FormLabel>Hora de la cita</FormLabel>
                <div className="flex w-full items-center gap-4">
                  {/* Month */}
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="horaCita"
                      render={({ field }) => (
                        <FormItem>
                          {/*<FormLabel>Dia</FormLabel>*/}
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={datosCita.horaCita} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {/* mostrar items desde 8 hasta 21 con for */}
                              {Array.from({ length: 13 }, (_, i) => 8 + i).map(
                                (hour) => (
                                  <SelectItem key={`${hour}`} value={`${hour}`}>
                                    {hour}
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

                  <p className="text-3xl">:</p>

                  {/* minuto de la cita */}
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="minutoCita"
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
                                  placeholder={datosCita.minutoCita}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="00">00</SelectItem>
                              <SelectItem value="30">30</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full justify-center gap-5 pt-5">
            <Button
              type="submit"
              className="rounded-3xl bg-green-500 px-16 py-7 font-bold hover:bg-green-600"
            >
              Modificar cita
            </Button>
            <Button className="rounded-3xl bg-red-500 px-16 py-7 font-bold hover:bg-red-600">
              Cancelar cita
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormCrearCuenta;
