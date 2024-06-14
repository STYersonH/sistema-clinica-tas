import Image from "next/image";
import ButtonCreateAccount from "./components/ButtonCreateAccount";

export default function Home() {
  return (
    <div className="flex justify-center">
      <div className="w-[1900px]">
        {/* Header */}
        <div className="flex justify-end">
          <button className="mr-10 mt-10 rounded-full bg-green-400 px-16 py-3 text-xl font-bold text-white transition-colors duration-200 hover:bg-green-500">
            LOGIN{" "}
          </button>
        </div>

        {/* Main */}
        <main
          className="flex items-center justify-center gap-20"
          style={{ height: "calc(100vh - 300px)" }}
        >
          {/* imagen */}
          <Image
            src="/Illustration & Title.svg"
            alt="inicial img"
            width={600}
            height={600}
          />
          {/* Opciones de crear cuenta */}
          <div className="flex flex-col items-center">
            {/*titulo*/}
            <div className="mb-12 flex items-center gap-4">
              <Image
                src={"/Luxi-Hosting-Logo.svg"}
                alt="inicial img"
                width={50}
                height={50}
              />
              <h2 className="text-3xl">CLINICA TAS MAL</h2>
            </div>

            {/*Botones de creacion*/}
            <div className="flex flex-col gap-5">
              <ButtonCreateAccount
                img={"/doc icon.svg"}
                imgSize={60}
                tipo="MEDICO"
                href={"/formulario-medico"}
              />
              <ButtonCreateAccount
                img={"/paciente icon.svg"}
                imgSize={60}
                tipo="PACIENTE"
                href={"/formulario-paciente"}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}