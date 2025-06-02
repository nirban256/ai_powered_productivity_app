import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserOrThrow } from "@/lib/get-user";

const GET = async (
    req: Request,
    { params }: { params: { id: string } }
) => {
    try {
        const session = getCurrentUserOrThrow();

        const userWithNotes = await db.user.findUnique({
            where: { email: (await session).email },
            include: {
                notes: true
            }
        });
        if (!userWithNotes) return new NextResponse("User does not exists!", { status: 404 });

        const { id } = await params;
        const notes = await db.notes.findUnique({ where: { userId: (await session).id, id: id } });
        if (!notes) return new NextResponse("No notes found", { status: 404 });

        return NextResponse.json(notes);
    } catch (error) {
        console.error("Error getting notes by Id", error);
    }
}

const PUT = async (
    req: Request,
    { params }: { params: { id: string } }
) => {
    try {
        const session = getCurrentUserOrThrow();

        const { title, description } = await req.json();
        if (!title) {
            return new NextResponse("Invalid information for the fields", { status: 400 });
        }

        const userWithNotes = await db.user.findUnique({
            where: { email: (await session).email },
            include: {
                notes: true
            }
        });
        if (!userWithNotes) return new NextResponse("User does not exists!", { status: 404 });

        const { id } = await params;
        const notes = await db.notes.findUnique({ where: { userId: (await session).id, id } });
        if (!notes) return new NextResponse("No note found with the given id", { status: 404 });

        await db.notes.update({
            where: { id: id },
            data: {
                title,
                description
            }
        });

        return new NextResponse("Note with id " + id + " updated successfully", { status: 200 });
    } catch (error) {
        console.error("Error getting notes by Id", error);
    }
}

const DELETE = async (
    req: Request,
    { params }: { params: { id: string } }
) => {
    try {
        const session = getCurrentUserOrThrow();

        const userWithNotes = await db.user.findUnique({
            where: { email: (await session).email },
            include: {
                notes: true
            }
        });
        if (!userWithNotes) return new NextResponse("User does not exist", { status: 404 });

        const { id } = await params;
        const notes = await db.notes.findUnique({ where: { userId: (await session).id, id: id } });

        if (!notes) return new NextResponse("No note found with the given id", { status: 404 });

        await db.notes.delete({ where: { userId: (await session).id, id: id } });

        return new NextResponse("Note with id " + id + " deleted successfully", { status: 200 });
    } catch (error) {
        console.error("Error deleting notes", error);
    }
}

export { GET, PUT, DELETE };