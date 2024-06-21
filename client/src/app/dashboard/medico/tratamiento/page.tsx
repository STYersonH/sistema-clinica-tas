"use client";

import React, { useState } from "react";
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
  diagnostico: z.string().min(1, "Por favor escriba un diagnostico"),
  // fecha obligatoria
  tipoTratamiento: z
    .string()
    .min(1, "Por favor seleccione un tipo de tratamiento"),
  descripcion: z.string().min(1, "Por favor escriba una descripcion"),
  medicamento: z.string().min(1, "Por favor seleccione un medicamento"),
  dosis: z.string().min(1, "Por favor escriba la dosis"),
  frecuencia: z.string().min(1, "Por favor escriba la frecuencia"),
  duracion: z.string().min(1, "Por favor escriba la duracion"),
});

interface Tratamiento {
  tipo: string;
  nombre?: string;
  dosis?: string;
  frecuencia?: string;
  duracion?: string;
  descripcion?: string;
}

const TraramientoPage = () => {
  const [agregarTratamiento, setAgregarTratamiento] = useState(false);
  const [tipoTratamiento, setTipoTratamiento] = useState("");
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([
    {
      tipo: "medicamento",
      nombre: "Paracetamol",
      dosis: "800ml",
      frecuencia: "Cada 8 horas",
      duracion: "3 días",
    },
    {
      tipo: "terapia",
      descripcion: "Terapia de relajación y respiración por 30 minutos al día",
    },
    {
      tipo: "cirugia",
      descripcion:
        "Cirugía de extracción de muelas del juicio (agendar la operacion)",
    },
  ]);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Obtener el valor del parametro tipo
  const tipo = searchParams.get("tipo");
  console.log(tipo);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diagnostico: "",
      tipoTratamiento: "",
      descripcion: "",
      dosis: "",
      medicamento: "",
      frecuencia: "",
      duracion: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const handleAgregarTratamiento = (e: any) => {
    e.preventDefault();

    if (tipoTratamiento === "medicamento") {
      if (
        form.getValues("medicamento") != "" &&
        form.getValues("frecuencia") != "" &&
        form.getValues("duracion") != ""
      ) {
        setTratamientos([
          ...tratamientos,
          {
            tipo: tipoTratamiento,
            nombre: form.getValues("medicamento"),
            frecuencia: form.getValues("frecuencia"),
            duracion: form.getValues("duracion"),
          },
        ]);
        setTipoTratamiento("");
        setAgregarTratamiento(false);
      }
    }

    if (tipoTratamiento !== "medicamento") {
      console.log(form.getValues("descripcion"));
      if (form.getValues("descripcion") != "") {
        setTratamientos([
          ...tratamientos,
          {
            tipo: tipoTratamiento,
            descripcion: form.getValues("descripcion"),
          },
        ]);
        setTipoTratamiento("");
        setAgregarTratamiento(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-blue-primary py-10 pt-24">
      <div
        className="flex gap-6"
        onClick={() => {
          router.push("/dashboard/medico");
        }}
      >
        <div className="group mb-10 flex cursor-pointer items-center rounded-full bg-white px-10 py-5 text-4xl font-bold text-blue-primary">
          <FaAngleLeft className="transition-transform duration-200 group-hover:scale-125" />
        </div>
        <h2 className="mb-10 rounded-full bg-white px-10 py-5 text-4xl font-bold text-blue-primary">
          Diagnostico y tratamiento
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[800px] space-y-8 rounded-3xl border-2 border-solid bg-white p-10"
        >
          {/* Motivo */}
          <div>
            <FormField
              control={form.control}
              name="diagnostico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-primary">
                    Escribir el diagnostico obtenido
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escribir el diagnósito de la cita médica"
                      id="message-2"
                      className="border-blue-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Tratamiento */}
          <>
            <div className="flex w-full flex-col items-center rounded-3xl border-2 border-solid border-blue-primary py-10">
              <h2 className="mb-5 text-2xl font-bold text-blue-primary">
                TRATAMIENTO A SEGUIR
              </h2>

              {tratamientos.map((tratamiento, index) => {
                if (tratamiento.tipo === "medicamento") {
                  return (
                    <div
                      key={index}
                      className="m-2 flex w-[90%] flex-col gap-3 rounded-2xl bg-blue-primary py-5 text-white"
                    >
                      <div className="flex justify-center">
                        <h3 className="rounded-full border-2 border-solid border-white px-6 py-1 text-xl">
                          {tratamiento.tipo}
                        </h3>
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="text-2xl font-bold">
                          Medicamento:{"  "}
                          <span className="font-normal">
                            {tratamiento.nombre}
                          </span>
                        </p>
                        <div className="flex justify-around gap-10">
                          <p className="font-bold">
                            dosis:{" "}
                            <span className="font-normal">
                              {tratamiento.dosis}
                            </span>
                          </p>
                          <p className="font-bold">
                            frecuencia:{" "}
                            <span className="font-normal">
                              {tratamiento.frecuencia}
                            </span>
                          </p>
                          <p className="font-bold">
                            duracion:{" "}
                            <span className="font-normal">
                              {tratamiento.duracion}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      className="m-2 flex w-[90%] flex-col gap-3 rounded-2xl bg-blue-primary px-10 py-5 text-white"
                    >
                      <div className="flex justify-center">
                        <h3 className="rounded-full border-2 border-solid border-white px-6 py-1 text-xl">
                          {tratamiento.tipo}
                        </h3>
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="text-center text-xl font-bold">
                          descripcion:{" "}
                          <span className="font-normal">
                            {tratamiento.descripcion}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                }
              })}

              {/* tipoTratamiento */}
              {agregarTratamiento && (
                <div className="item-center m-2 flex w-[90%] flex-col gap-3 rounded-2xl border-2 border-solid border-blue-primary bg-white px-10 py-5 text-blue-primary">
                  <div className="flex justify-center">
                    <FormField
                      control={form.control}
                      name="tipoTratamiento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de tratamiento</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setTipoTratamiento(value);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-64 border-blue-primary">
                                <SelectValue placeholder="tipo de tratamiento" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="medicamento">
                                Medicamento
                              </SelectItem>
                              <SelectItem value="terapia">Terapia</SelectItem>
                              <SelectItem value="cirugia">Cirugia</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {tipoTratamiento !== "" &&
                    tipoTratamiento == "medicamento" && (
                      <div className="flex flex-1 flex-col gap-3 pt-1">
                        <div className="flex w-full flex-col gap-4">
                          {/* detalles de tratamietno */}
                          <div className="flex w-full gap-4">
                            <div className="flex-1">
                              <FormField
                                control={form.control}
                                name="medicamento"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Medicamento</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="elegir" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="1">
                                          Medicamento 1
                                        </SelectItem>
                                        <SelectItem value="2">
                                          Medicamento 2
                                        </SelectItem>
                                        <SelectItem value="3">
                                          Medicamento 3
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="flex-1">
                              <FormField
                                control={form.control}
                                name="dosis"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Dosis</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        placeholder="800ml"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>

                          <div className="flex w-full gap-4">
                            <div className="flex-1">
                              <FormField
                                control={form.control}
                                name="frecuencia"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Frecuencia</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        placeholder="Cada 8 horas"
                                        {...field}
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
                                name="duracion"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Duracion</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        placeholder="3 días"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                        {/* avanzamos hasta aqui */}
                      </div>
                    )}

                  {tipoTratamiento !== "" &&
                    tipoTratamiento !== "medicamento" && (
                      <FormField
                        control={form.control}
                        name="descripcion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-primary">
                              Descripcion de tratamiento
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Escribir descripcion del tratamiento"
                                id="message-2"
                                className="border-blue-primary"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                  {tipoTratamiento !== "" && (
                    <Button
                      type="submit"
                      className="mt-4 w-full rounded-3xl bg-blue-primary px-16 py-7 font-bold hover:bg-blue-primary"
                      onClick={handleAgregarTratamiento}
                    >
                      Agregar tratamiento
                    </Button>
                  )}
                </div>
              )}

              {!agregarTratamiento && (
                <div
                  className="flex h-10 w-10 cursor-pointer justify-center rounded-full bg-blue-primary text-3xl text-white hover:bg-blue-500"
                  onClick={() => setAgregarTratamiento(true)}
                >
                  +
                </div>
              )}
            </div>

            <div className="flex w-full justify-center">
              <Button
                type="submit"
                className="mx-auto rounded-3xl bg-green-500 px-16 py-7 font-bold hover:bg-green-600"
              >
                Proceder
              </Button>
            </div>
          </>
        </form>
      </Form>
    </div>
  );
};

export default TraramientoPage;
