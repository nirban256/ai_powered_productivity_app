import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserOrThrow } from "@/lib/get-user";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
    try {
        const session = await getCurrentUserOrThrow();
        const cacheKey = `notes:${session.email}`;

        const { title, description } = await req.json();
        if (
            !title ||
            !description
        ) {
            return new NextResponse("Invalid information for the fields", { status: 400 });
        }

        const user = await db.user.findUnique({ where: { email: session.email } });
        if (!user) return new NextResponse("User does not exist", { status: 404 });

        await db.notes.create({
            data: {
                title,
                description,
                userId: session.id
            }
        });

        await redis.del(cacheKey);

        return new NextResponse("Note added successfully", { status: 201 });
    } catch (error) {
        console.error("Error in creating note", error);
    }
}

export async function GET(req: Request) {
    try {
        const session = await getCurrentUserOrThrow();
        const cacheKey = `notes:${session.email}`;

        const cached = await redis.get(cacheKey);
        if (typeof cached === "string") return NextResponse.json(JSON.parse(cached));

        const userWithNotes = await db.user.findUnique({
            where: { email: session.email },
            include: {
                notes: true
            }
        });
        if (!userWithNotes) return new NextResponse("User does not exists!", { status: 404 });

        await redis.set(cacheKey, JSON.stringify(userWithNotes.notes), { ex: 300 });

        return NextResponse.json(userWithNotes.notes);
    } catch (error) {
        console.error("Error fetching all the notes", error);
    }
}