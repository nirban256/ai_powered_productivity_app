import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserOrThrow } from "@/lib/get-user";

const POST = async (req: Request) => {
    try {
        const session = getCurrentUserOrThrow();

        const { title, status, priority } = await req.json();
        if (
            !title ||
            (priority !== undefined && !["severe", "high", "low"].includes(priority)) ||
            (status !== undefined && typeof status !== "boolean")
        ) {
            return new NextResponse("Invalid information for the fields", { status: 400 });
        }

        const user = await db.user.findMany({ where: { email: (await session).email } });
        if (!user) {
            return new NextResponse("User does not exist!", { status: 400 });
        }

        await db.tasks.create({
            data: {
                title,
                status,
                userId: (await session).id,
                priority
            }
        });

        return new NextResponse("Task added successfully for user " + (await session).id, { status: 201 });
    } catch (error) {
        console.error("Error adding task ", error);
    }
}

const GET = async () => {
    try {
        const session = getCurrentUserOrThrow();

        const userWithTasks = await db.user.findUnique({
            where: { email: (await session).email },
            include: {
                tasks: true
            }
        });

        if (!userWithTasks) return new NextResponse("User not found", { status: 404 });

        return NextResponse.json(userWithTasks.tasks);
    } catch (error) {
        console.error("Error getting all the tasks", error);
    }
}

export { POST, GET };