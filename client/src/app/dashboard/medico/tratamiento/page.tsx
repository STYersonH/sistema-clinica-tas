"use client";

import React, { useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { createHistorialClinico } from "@/app/apiRoutes/historialClinic/historialClinic.api";
import { getMedicamentos } from "@/app/apiRoutes/medicamentos/medicamentos.api";
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
import { useToast } from "@/components/ui/use-toast";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

const formSchema = z.object({
  diagnostico: z.string().min(1, "Por favor escriba el diagnostico"),
  tipoTratamiento: z.string(),
  descripcion: z.string(),
  medicamento: z.string(),
  dosis: z.string(),
  frecuencia: z.string(),
  duracion: z.string(),
});

interface Tratamiento {
  tipo: string;
  nombreMedicamento?: string;
  dosis?: string;
  frecuencia?: string;
  duracion?: string;
  descripcion?: string;
  receta?: any[];
}

const TraramientoPage = () => {
  const [agregarTratamiento, setAgregarTratamiento] = useState(false);
  const [tipoTratamiento, setTipoTratamiento] = useState("");
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [medicamentos, setMedicamentos] = useState([]);

  const { toast } = useToast();

  const fetchMedicamentos = async () => {
    const response = await getMedicamentos();
    setMedicamentos(response.data.data);
  };

  useEffect(() => {
    fetchMedicamentos();
  }, []);

  const searchParams = useSearchParams();
  const citaID = searchParams.get("citaID");
  const dniPaciente = searchParams.get("dniPaciente");
  const liscenciaMedico = searchParams.get("liscenciaMedico");
  // console.log(citaID, dniPaciente, liscenciaMedico);

  const router = useRouter();

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

  function getFechaActual() {
    const fechaActual = new Date();
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1; // Sumamos 1 porque getMonth devuelve de 0 a 11
    const dia = fechaActual.getDate();

    const fechaFormateada = `${año}-${mes < 10 ? "0" + mes : mes}-${dia < 10 ? "0" + dia : dia}`;
    return fechaFormateada;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      //Construir data
      const dataNewHistorialClinic = {
        Idcita: parseInt(citaID),
        Diagnostico: values.diagnostico,
        DniPaciente: dniPaciente,
        LicenciaMedico: liscenciaMedico,
        FechaDiagnostico: getFechaActual(),
        Tratamientos: tratamientos,
      };
      const response = await createHistorialClinico(dataNewHistorialClinic);
      toast({
        title: "Se ha formulado el diagnositco y tratamiento exitosamente",
        description: `Ha concluido con la cita del paciente ${dniPaciente}`,
      });

      router.push("/dashboard/medico");
    } catch (err) {
      console.log(err);
    }
  }

  const handleAgregarTratamiento = () => {
    const values = form.getValues();

    if (tipoTratamiento === "medicamento") {
      if (values.medicamento && values.frecuencia && values.duracion) {
        setTratamientos([
          ...tratamientos,
          {
            tipo: tipoTratamiento,
            descripcion: "",
            receta: [
              {
                nombreMedicamento: values.medicamento,
                dosis: values.dosis,
                frecuencia: values.frecuencia,
                duracion: values.duracion,
              },
            ],
          },
        ]);
        setTipoTratamiento("");
        setAgregarTratamiento(false);
      }
    }

    if (tipoTratamiento !== "medicamento") {
      if (values.descripcion) {
        setTratamientos([
          ...tratamientos,
          {
            tipo: tipoTratamiento,
            descripcion: values.descripcion,
            receta: [],
          },
        ]);
        setTipoTratamiento("");
        setAgregarTratamiento(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-blue-primary py-10 pt-32">
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
          {/* Diagnostico */}
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
                      placeholder="Escribir el diagnostico de la cita médica"
                      className="border-blue-primary"
                      {...field}
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
                            {tratamiento.nombreMedicamento}
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
                    tipoTratamiento === "medicamento" && (
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
                                        {medicamentos.map(
                                          (medicamento: any, index: number) => (
                                            <SelectItem
                                              key={index}
                                              value={medicamento.Nombre}
                                            >
                                              {medicamento.Nombre}
                                            </SelectItem>
                                          ),
                                        )}
                                        {/* <SelectItem value="Paracetamol">
                                          Paracetamol
                                        </SelectItem>
                                        <SelectItem value="Ibuprofeno">
                                          Ibuprofeno
                                        </SelectItem>
                                        <SelectItem value="Amoxicilina">
                                          Amoxicilina
                                        </SelectItem> */}
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
                                className="border-blue-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                  {tipoTratamiento !== "" && (
                    <Button
                      type="button"
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
