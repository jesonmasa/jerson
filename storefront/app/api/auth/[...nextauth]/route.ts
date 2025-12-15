import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                // Sincronizar con nuestro Backend
                // Esto asegura que el usuario exista en la tabla 'users' y tenga un tenantId
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                if (!apiUrl) console.warn('Missing NEXT_PUBLIC_API_URL in auth route');

                // Normalizar URL (quitar /api si ya lo tiene o asegurar que lo tenga)
                // Nota: En NextAuth server-side, mejor usar URL absoluta si es posible.
                // Vercel provee NEXT_PUBLIC_API_URL usuarlmente.

                await fetch(`${apiUrl}/auth/google-callback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        providerId: user.id
                    })
                });

                return true;
            } catch (error) {
                console.error("Error syncing Google user:", error);
                return true; // Permitir login aunque falle la sync (fallback)
            }
        },
        async session({ session, token }) {
            // Aquí idealmente cargaríamos el rol/tenantId desde el backend o token
            // Por simplicidad en NextAuth, confiamos en que signIn ya sincronizó.
            // Para tener tenantId en sesión, deberíamos retornarlo en JWT callback y pasarlo aquí.
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
