import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "../../../apiRoutes/authLogin/authLoginApi";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "77777777" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "********",
        },
      },
      // autorizar la entrada si los datos son correctos
      async authorize(credentials) {
        // credentials tiene la informacion de nuestros datos definidos antes

        // revisar si el usuario existe en la base de datos
        const res = await login({
          username: credentials.username,
          password: credentials.password,
        });

        // Si hay exito redirigir a la pagina principal del usuario
        if (res.status === 200) {
          const user = res.data.data; // datos del usuario
          console.log("Usuario", user);
          return user;
        } else {
          console.log("Error al loguearse");
          throw new Error("Error al loguearse");
        }
      },
    }),
  ],
  callbacks: {
    // jwt para guardar la informacion del usuario en el token
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    // session para guardar la informacion del usuario en la sesion
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
