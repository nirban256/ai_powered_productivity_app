import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return new NextResponse('Missing fields', { status: 400 });
        }

        const existingUser = await db.user.findUnique({ where: { email } });
        if (existingUser) return new NextResponse("User already exists", { status: 409 });

        const hashedPassword = await hash(password, 10);

        await db.user.create({
            data: {
                name, email, hashedPassword
            }
        })

        return new NextResponse("User created successfully", { status: 201 });
    } catch (error) {
        console.error(error)
        return new NextResponse('Internal error', { status: 500 })
    }
}


//  if email return user already exists then redirect to sign in page in the frontend.