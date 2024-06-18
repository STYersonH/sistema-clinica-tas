"use client";

import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";

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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { useRouter, useSearchParams } from "next/navigation";

const formSchema = z.object({
  username: z.string(),
  password: z.string().min(8).max(50),
});

const LoginPage = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [error, setError] = useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    const res = await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false, // no redireccionar a una pagina de respuesta
    });

    if (!res) {
      // Handle the case where res is undefined
      setError("An unexpected error occurred.");
    } else if (!res.ok) {
      // Handle the case where res is defined but not ok
      setError(res.error);
    } else {
      // Handle the success case
      console.log(res);
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-green-500">
      <div
        className="flex gap-6"
        onClick={() => {
          router.push("/");
        }}
      >
        <div className="group mb-10 flex cursor-pointer items-center rounded-full bg-white px-10 py-5 text-4xl font-bold text-green-500">
          <FaAngleLeft className="transition-transform duration-200 group-hover:scale-125" />
        </div>
        <h2 className="mb-10 rounded-full bg-white px-10 py-5 text-4xl font-bold text-green-500">
          Inicio de sesion
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          //onSubmit={handleS}
          className="w-[500px] space-y-8 rounded-3xl border-2 border-solid bg-white p-10"
        >
          {/* username y password */}
          <div className="flex w-full flex-col gap-6">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de usuario</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="77777777"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="*********"
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

          <div className="w-full pt-5 text-center">
            <Button
              type="submit"
              className="rounded-3xl bg-green-500 px-16 py-7 font-bold hover:bg-green-600"
            >
              Acceder
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
