import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserOrThrow } from "@/lib/get-user";

const GET = async (
    req: Request,
    { params }: { params: { id: string } }) => {
    try {
        const session = getCurrentUserOrThrow();

        const userWithTasks = await db.user.findUnique({
            where: { id: (await session).id },
            include: {
                tasks: true
            }
        });
        if (!userWithTasks) return new NextResponse("User not found", { status: 404 });

        const { id } = await params;
        const task = await db.tasks.findFirst({ where: { userId: (await session).id, id: id } });
        if (!task) return new NextResponse("Invalid id", { status: 404 });

        return NextResponse.json(task);
    } catch (error) {
        console.error(error);
    }
}

const PUT = async (
    req: Request,
    { params }: { params: { id: string } }
) => {
    try {
        const session = getCurrentUserOrThrow();

        const userWithTasks = await db.user.findUnique({
            where: { id: (await session).id },
            include: {
                tasks: true
            }
        });
        if (!userWithTasks) return new NextResponse("User not found", { status: 404 });

        const { id } = await params;
        const task = await db.tasks.findUnique({ where: { userId: (await session).id, id: id } });
        if (!task) return new NextResponse("Invalid id", { status: 404 });

        const { title, status, priority } = await req.json();
        if (
            (priority !== undefined && !["severe", "high", "low"].includes(priority)) ||
            (status !== undefined && typeof status !== "boolean")
        ) {
            return new NextResponse("Invalid information for the fields", { status: 400 });
        }

        await db.tasks.update({
            where: { id: id },
            data: {
                title,
                status,
                priority
            }
        });

        return new NextResponse("Task with id " + id + " updated successfully", { status: 200 });
    } catch (error) {
        console.error("Error updating task", error);
    }
}

const DELETE = async (
    req: Request,
    { params }: { params: { id: string } }
) => {
    try {
        const session = getCurrentUserOrThrow();

        const userWithTasks = await db.user.findUnique({
            where: { id: (await session).id },
            include: {
                tasks: true
            }
        });
        if (!userWithTasks) return new NextResponse("User not found", { status: 404 });

        const { id } = await params;
        const task = await db.tasks.findUnique({ where: { userId: (await session).id, id: id } });
        if (!task) return new NextResponse("Invalid id", { status: 404 });

        await db.tasks.delete({ where: { userId: (await session).id, id: id } });

        return new NextResponse("Task with " + id + " deleted successfully", { status: 200 });
    } catch (error) {
        console.error("Error deleting task", error);
    }
}

export { GET, PUT, DELETE };