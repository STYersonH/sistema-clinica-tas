"use client";

import { asegurar } from "@/app/apiRoutes/asegurados/aseguradosApi";
import { getTiposSeguro } from "@/app/apiRoutes/seguros/segurosApi";

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
import { useToast } from "@/components/ui/use-toast";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  tipoSeguro: z.string().min(1, "Por favor seleccione un tipo de seguro"),
  cantAniosSeguro: z
    .string()
    .min(1, "Por favor seleccione la cantidad de años"),
});

// Extend the User type to include the ID property
type ExtendedUser = {
  IdPaciente?: string | null;
};

const AsegurarPage = () => {
  // obtener los datos de la session
  const { data: session, status } = useSession();
  const IdPaciente = (session?.user as ExtendedUser)?.IdPaciente;
  const [tiposSeguro, setTiposSeguro] = useState([]);

  const [procedido, setProcedido] = useState(false);
  const [tipoSeguro, setTipoSeguro] = useState({});
  const [cantAniosSeguro, setCantAniosSeguro] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  // Obtener el valor del parametro tipo
  const tipo = searchParams.get("tipo");
  console.log(tipo);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipoSeguro: "",
      cantAniosSeguro: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    const datosSeguro = {
      idPaciente: IdPaciente,
      tipo: tipoSeguro.TipoSeguro,
      cantAnios: parseInt(cantAniosSeguro, 10) || 0,
    };

    try {
      const res = await asegurar(datosSeguro);
      console.log(res);
      toast({
        title: "Se ha asegurado de manera exitosa",
        description: `Se ha asegurado por ${cantAniosSeguro} año(s) con el seguro ${tipoSeguro.TipoSeguro}`,
      });
      router.push("/dashboard/paciente/");
    } catch (error) {
      console.log("Error al asegurar");
    }
  }

  useEffect(() => {
    const ObtenerTiposSeguro = async () => {
      // obtener los tipos de seguro
      const res = await getTiposSeguro();
      setTiposSeguro(res.data.data);
    };

    ObtenerTiposSeguro();
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
          Contratar seguro de salud
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[800px] space-y-8 rounded-3xl border-2 border-solid bg-white p-10"
        >
          <div className="flex gap-6">
            {/* tipo de seguro*/}
            <div className="flex-1">
              <FormField
                control={form.control}
                name="tipoSeguro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de seguro</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setTipoSeguro(tiposSeguro[value - 1]); // 2. Update state on value change
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo de seguro" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tiposSeguro.map((seguro) => (
                            <SelectItem
                              key={seguro.ID}
                              value={seguro?.ID.toString()}
                            >
                              {seguro?.TipoSeguro}
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

            {/* tipo de seguro*/}
            <div className="flex-1">
              <FormField
                control={form.control}
                name="cantAniosSeguro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad de anios</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setCantAniosSeguro(value); // 2. Update state on value change
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Tiempo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 año</SelectItem>
                          <SelectItem value="2">2 años</SelectItem>
                          <SelectItem value="3">3 años</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="w-full pt-5 text-center">
            {!procedido && (
              <Button
                type="submit"
                className="rounded-3xl bg-green-500 px-16 py-7 font-bold hover:bg-green-600"
                onClick={() => {
                  if (cantAniosSeguro && tipoSeguro) {
                    setProcedido(true);
                  } else {
                    alert(
                      "Por favor seleccion el tipo de seguro y la cantidad de años que desea.",
                    );
                  }
                }}
              >
                Proceder
              </Button>
            )}
          </div>

          {/* mostrar como un comprobante de pago antes mostrando el precio por un anio y luego por 3 anios y despues el total */}

          {procedido && (
            <>
              <div className="flex w-full flex-col items-center rounded-3xl bg-gray-200 py-10">
                <h2 className="mb-10 text-3xl">Boleta a pagar</h2>
                <div className="flex w-full justify-around">
                  <p className="text-xl">
                    Seguro de salud{" "}
                    <span className="font-bold">{tipoSeguro.TipoSeguro}</span>
                  </p>
                  <p className="text-xl font-bold">S/.{tipoSeguro.Precio}</p>
                </div>
                {/* crear una linea separadora */}
                <div className="mx-4 my-4 h-[2px] w-[70%] bg-gray-400 text-gray-500" />
                <div className="flex w-full justify-around gap-16">
                  <p className="text-xl">
                    Total por{" "}
                    <span className="font-bold">{cantAniosSeguro} año(s)</span>
                  </p>
                  <p className="text-xl font-bold">
                    S/.{tipoSeguro.Precio * Number(cantAniosSeguro)}
                  </p>
                </div>
              </div>
              <div className="flex w-full justify-center">
                <Button
                  type="submit"
                  className="mx-auto rounded-3xl bg-green-500 px-16 py-7 font-bold hover:bg-green-600"
                  onClick={() => setProcedido(true)}
                >
                  Obtener seguro
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>
    </div>
  );
};

export default AsegurarPage;
