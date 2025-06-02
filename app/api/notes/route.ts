import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserOrThrow } from "@/lib/get-user";

const POST = async (req: Request) => {
    try {
        const session = getCurrentUserOrThrow();

        const { title, description } = await req.json();
        if (
            !title ||
            !description
        ) {
            return new NextResponse("Invalid information for the fields", { status: 400 });
        }

        const user = await db.user.findUnique({ where: { email: (await session).email } });
        if (!user) return new NextResponse("User does not exist", { status: 404 });

        await db.notes.create({
            data: {
                title,
                description,
                userId: (await session).id
            }
        });

        return new NextResponse("Note added successfully", { status: 201 });
    } catch (error) {
        console.error("Error in creating note", error);
    }
}

const GET = async (req: Request) => {
    try {
        const session = getCurrentUserOrThrow();

        const userWithNotes = await db.user.findUnique({
            where: { email: (await session).email },
            include: {
                notes: true
            }
        });
        if (!userWithNotes) return new NextResponse("User does not exists!", { status: 404 });

        return NextResponse.json(userWithNotes.notes);
    } catch (error) {
        console.error("Error fetching all the notes", error);
    }
}

export { POST, GET };