import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import { compare } from 'bcryptjs'


export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(db),
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 24
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const user = await db.user.findUnique({
                    where: { email: credentials.email },
                })

                if (!user || !user?.hashedPassword) return null

                const isValid = await compare(credentials.password, user.hashedPassword)
                if (!isValid) return null

                return {
                    id: user.id,
                    name: user.name ?? '',
                    email: user.email ?? '',
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
                session.user.email = token.email as string
                session.user.name = token.name as string
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.createdAt = Math.floor(Date.now() / 1000); // Current time in seconds
            }
            return token
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}
