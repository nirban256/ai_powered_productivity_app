import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserOrThrow } from "@/lib/get-user";
import { redis } from "@/lib/redis";

const GET = async (
    req: Request,
    { params }: { params: { id: string } }
) => {
    try {
        const session = await getCurrentUserOrThrow();

        const userWithNotes = await db.user.findUnique({
            where: { email: session.email },
            include: {
                notes: true
            }
        });
        if (!userWithNotes) return new NextResponse("User does not exists!", { status: 404 });

        const { id } = await params;
        const notes = await db.notes.findUnique({ where: { userId: session.id, id: id } });
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
        const session = await getCurrentUserOrThrow();
        const cacheKey = `notes:${session.email}`;

        const { title, description } = await req.json();
        if (!title) {
            return new NextResponse("Invalid information for the fields", { status: 400 });
        }

        const userWithNotes = await db.user.findUnique({
            where: { email: session.email },
            include: {
                notes: true
            }
        });
        if (!userWithNotes) return new NextResponse("User does not exists!", { status: 404 });

        const { id } = await params;
        const notes = await db.notes.findUnique({ where: { userId: session.id, id } });
        if (!notes) return new NextResponse("No note found with the given id", { status: 404 });

        await db.notes.update({
            where: { id: id },
            data: {
                title,
                description
            }
        });

        await redis.del(cacheKey);

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
        const session = await getCurrentUserOrThrow();
        const cacheKey = `notes:${session.email}`;

        const userWithNotes = await db.user.findUnique({
            where: { email: session.email },
            include: {
                notes: true
            }
        });
        if (!userWithNotes) return new NextResponse("User does not exist", { status: 404 });

        const { id } = await params;
        const notes = await db.notes.findUnique({ where: { userId: session.id, id: id } });

        if (!notes) return new NextResponse("No note found with the given id", { status: 404 });

        await db.notes.delete({ where: { userId: session.id, id: id } });
        await redis.del(cacheKey);

        return new NextResponse("Note with id " + id + " deleted successfully", { status: 200 });
    } catch (error) {
        console.error("Error deleting notes", error);
    }
}

export { GET, PUT, DELETE };