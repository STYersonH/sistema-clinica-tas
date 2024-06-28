"use client";

import { getEspecialidades } from "@/app/apiRoutes/especialidades/especialidadesApi";
import { postCita } from "@/app/apiRoutes/citas/citasApi";

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

import { format } from "date-fns";
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
  especialidad: z.string().min(1, { message: "elegir Especialidad" }),
  motivoConsulta: z
    .string()
    .min(1, { message: "escribir motivo de la consulta" }),
  // fecha obligatoria
  fechaCita: z.date({ message: "elegir fecha" }),
  horaCita: z.string().min(1, { message: "elegir hora" }),
  minutoCita: z.string().min(1, { message: "elegir minutos" }),
});

type ExtendedUser = {
  Dni?: string | null;
};

const FormCrearCuenta = () => {
  const router = useRouter();
  const [especialidades, setEspecialidades] = useState([]);
  const { toast } = useToast();

  // obtener el dni del paciente desde los datos de sesion
  const { data: session, status } = useSession();
  const DNI = (session?.user as ExtendedUser)?.Dni;

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

    const data = {
      DNIpaciente: DNI,
      especialidadId: parseInt(values.especialidad),
      motivo: values.motivoConsulta,
      fecha: fechaConFormato,
      hora: values.horaCita,
      minuto: values.minutoCita,
    };
    console.log(data);

    try {
      const res = await postCita(data);
      console.log(res.status);
      toast({
        title: "Se reservo la cita correctamente",
        description: `Tiene una cita el ${fechaConFormato} a las ${values.horaCita}:${values.minutoCita}`,
      });
      router.push("/dashboard/paciente/");
    } catch (err: any) {
      console.log("Hubo un error al crear la cita", err);
      toast({
        variant: "destructive",
        title: "Se produjo un error al intentar reservar la cita",
        description: "Intente nuevamente.",
      });
    }
  }

  useEffect(() => {
    const ObtenerEspecialidades = async () => {
      // obtener los tipos de seguro
      const res = await getEspecialidades();
      setEspecialidades(res.data.data);
      console.log(res.data.data);
    };

    ObtenerEspecialidades();
  }, []);

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
          Reserva de cita medica
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
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar especialidad" />
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
                                <SelectValue placeholder="hora" />
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
                                <SelectValue placeholder="minuto" />
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

          <div className="w-full pt-5 text-center">
            <Button
              type="submit"
              className="rounded-3xl bg-green-500 px-16 py-7 font-bold hover:bg-green-600"
            >
              Agendar cita
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormCrearCuenta;
