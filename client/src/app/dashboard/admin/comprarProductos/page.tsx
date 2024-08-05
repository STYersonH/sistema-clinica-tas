"use client";

import React, { useState } from "react";
import ButtonToChange from "@/components/Button";

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
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { set } from "date-fns";

const formSchema = z.object({
  producto: z.string().min(1, "Por favor escriba el diagnostico"),
  cantidad: z.string().min(1, "Por favor escriba la cantidad"),
});

const ComprarProductosPage = () => {
  const productos = [
    { id: 1, nombre: "Casaca MIT premium", precio: 140.0, stock: 5 },
    { id: 2, nombre: "Guantes de latex", precio: 20.0, stock: 10 },
    { id: 3, nombre: "Mascarilla N95", precio: 10.0, stock: 20 },
    { id: 4, nombre: "Gorro quirurgico", precio: 5.0, stock: 15 },
    { id: 5, nombre: "Zapatos quirurgicos", precio: 50.0, stock: 5 },
    { id: 6, nombre: "Gel antibacterial", precio: 5.0, stock: 10 },
  ];

  const [agregarProductoComprar, setAgregarProductoComprar] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidadDefinida, setCantidadDefinida] = useState(false);
  const [productosComprar, setProductosComprar] = useState([]);

  const { toast } = useToast();

  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      producto: "",
      cantidad: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      //Construir data
      const datosCompra = {
        productos: productosComprar,
      };
      console.log(datosCompra);
      toast({
        title: "Se ha realizado la compra",
        description: `Su monto de compra es de S/. 500.00`,
      });

      router.push("/dashboard/medico");
      router.refresh();
    } catch (err) {
      console.log(err);
    }
  }

  const handleAgregarProductoComprar = () => {
    const values = form.getValues();
    setProductosComprar([
      ...productosComprar,
      { nombre: values.producto, cantidad: values.cantidad },
    ]);
    setAgregarProductoComprar(false);
    setProductoSeleccionado("");
    console.log(values);
  };

  return (
    <main className="flex h-screen justify-center">
      <div className="flex h-screen w-[1150px] items-center justify-between">
        {/*Informacion del usuario*/}
        <div className="flex h-[696px] w-[600px] flex-col items-center rounded-2xl border border-gris p-10">
          <h1 className="text-blac font-boldk mb-5 w-full rounded-xl border-4 border-black py-2 text-center text-2xl font-bold">
            LISTA DE PRODUCTOS DISPONIBLES
          </h1>
          <div
            className="mt-5 grid w-[80%] grid-cols-3 gap-2 font-bold text-black"
            style={{ gridTemplateColumns: "5fr 2fr 1fr" }}
          >
            <p className="">Producto</p>
            <p className="">precio</p>
            <p className="">stock</p>
          </div>
          <div className="my-4 h-[2px] w-[80%] bg-black p-0"></div>
          {/* Productos disponibles */}

          {productos.map((producto, index) => (
            <div
              className="mt-5 grid w-[80%] grid-cols-3 gap-2 text-black"
              style={{ gridTemplateColumns: "5fr 2fr 1fr" }}
            >
              <p className="">{producto.nombre}</p>
              <p className="">S/.{producto.precio}</p>
              <p className="text-center">{producto.stock}</p>
            </div>
          ))}
        </div>

        <div className="flex h-[696px] w-[500px] flex-col gap-10">
          {/* Citas pendientes */}
          <div className="relative flex h-full w-full flex-col items-center rounded-2xl border border-gris p-10">
            <h1 className="mb-5 w-full rounded-xl border-4 border-black py-2 text-center text-2xl font-bold text-black">
              COMPRAR PRODUCTOS
            </h1>
            {/* productos */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-8 rounded-3xl border-2 border-solid bg-white"
              >
                {/* Tratamiento */}
                <>
                  <div className="flex h-[480px] w-full flex-col items-center rounded-xl border-2 border-solid border-black py-5">
                    <h2 className="mb-4 text-2xl font-bold text-black">
                      PRODUCTOS A COMPRAR
                    </h2>

                    <div
                      className="scroll-container flex w-full flex-col items-center"
                      style={{ maxHeight: "500px", overflowY: "auto" }}
                    >
                      {productosComprar.map((producto, index) => {
                        return (
                          <div
                            key={index}
                            className="m-2 flex w-[90%] items-center justify-center gap-3 rounded-2xl bg-black p-5 text-white"
                          >
                            <div className="flex justify-center">
                              <h3 className="rounded-full border-2 border-solid border-white px-6 py-1 text-lg">
                                {producto.nombre}
                              </h3>
                            </div>
                            <div className="flex flex-col items-center">
                              <p className="text-center text-xl font-bold">
                                x
                                <span className="font-normal">
                                  {producto.cantidad} unidades
                                </span>
                              </p>
                            </div>
                          </div>
                        );
                      })}

                      {/* tipoTratamiento */}
                      {agregarProductoComprar && (
                        <div className="item-center m-2 flex w-[90%] flex-col gap-3 rounded-2xl border-2 border-solid border-black bg-white px-10 py-5 text-black">
                          <div className="flex justify-center gap-x-5">
                            <FormField
                              control={form.control}
                              name="producto"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Producto</FormLabel>
                                  <Select
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      setProductoSeleccionado(value);
                                    }}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="w-64 border-black">
                                        <SelectValue placeholder="seleccione un producto" />
                                      </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                      {productos.map(
                                        (producto: any, index: number) => (
                                          <SelectItem
                                            key={index}
                                            value={producto.nombre}
                                          >
                                            {producto.nombre}
                                          </SelectItem>
                                        ),
                                      )}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="cantidad"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Cantidad</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="text"
                                      placeholder="3"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {productoSeleccionado !== "" && (
                            <Button
                              type="button"
                              className="mt-4 w-full rounded-3xl bg-black px-16 py-7 font-bold hover:bg-black"
                              onClick={handleAgregarProductoComprar}
                            >
                              Agregar Producto
                            </Button>
                          )}
                        </div>
                      )}

                      {!agregarProductoComprar && (
                        <div
                          className="mt-3 flex h-10 w-10 cursor-pointer justify-center rounded-full bg-black text-3xl text-white hover:bg-stone-800"
                          onClick={() => setAgregarProductoComprar(true)}
                        >
                          +
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex w-full justify-center gap-10">
                    <Button
                      type="submit"
                      className="rounded-3xl bg-green-500 px-16 py-2 font-bold hover:bg-green-600"
                    >
                      Proceder
                    </Button>
                  </div>
                </>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ComprarProductosPage;
