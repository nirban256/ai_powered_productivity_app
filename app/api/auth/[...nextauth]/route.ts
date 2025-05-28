import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Resend({
            from: "no-reply@aether.com",
            sendVerificationRequest: async ({ identifier: to, url, provider }) => {
                const res = await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${process.env.AUTH_RESEND_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        from: provider.from,
                        to,
                        subject: "Sign in to Your App",
                        html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                <h2>Sign in to Your App</h2>
                <p>Click the link below to sign in:</p>
                <a href="${url}" style="color: white; background-color: #0070f3; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Sign In</a>
                <p>If you did not request this, you can ignore this email.</p>
              </div>
            `,
                        text: `Sign in to Your App: ${url}`,
                    }),
                });

                if (!res.ok) {
                    throw new Error("Failed to send verification email via Resend.");
                }
            },
        }),
    ],
});


export { handlers as GET, handlers as POST };