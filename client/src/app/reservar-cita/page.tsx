"use client";

import React from "react";
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

const formSchema = z.object({
  especialidad: z.string(),
  // fecha obligatoria
  fechaCita: z.date(),
  horaCita: z.string().min(8).max(21),
  minutoCita: z.string().min(0).max(30),
});

const FormCrearCuenta = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Obtener el valor del parametro tipo
  const tipo = searchParams.get("tipo");
  console.log(tipo);

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
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar especialidad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Cardiologia">General</SelectItem>
                        <SelectItem value="Cardiologia">Cardiologia</SelectItem>
                        <SelectItem value="Dermatologia">
                          Dermatologia
                        </SelectItem>
                        <SelectItem value="Ginecologia">Ginecologia</SelectItem>
                        <SelectItem value="Neurologia">Neurologia</SelectItem>
                        <SelectItem value="Oftalmologia">
                          Oftalmologia
                        </SelectItem>
                        <SelectItem value="Otorrinolaringologia">
                          Otorrinolaringologia
                        </SelectItem>
                        <SelectItem value="Pediatra">Pediatra</SelectItem>
                        <SelectItem value="Psiquiatria">Psiquiatria</SelectItem>
                        <SelectItem value="Traumatologia">
                          Traumatologia
                        </SelectItem>
                        <SelectItem value="Urologia">Urologia</SelectItem>
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
              name="especialidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo de la consulta</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escribir el motivo de por que necesita una consulta"
                      id="message-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Fecha y Hora */}
          <div className="flex">
            {/*fecha */}
            <div className="flex-1">
              <FormField
                control={form.control}
                name="fechaCita"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de la cita</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
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
              {/* Fecha de cumpleanios */}
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

                  {/* Day */}
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
