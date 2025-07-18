import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserOrThrow } from "@/lib/get-user";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
    try {
        const session = await getCurrentUserOrThrow();
        const cacheKey = `tasks:${session.email}`;

        const { title, status, priority } = await req.json();
        if (
            !title ||
            (priority !== undefined && !["severe", "high", "low"].includes(priority)) ||
            (status !== undefined && typeof status !== "boolean")
        ) {
            return new NextResponse("Invalid information for the fields", { status: 400 });
        }

        const user = await db.user.findMany({ where: { email: session.email } });
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

        await redis.del(cacheKey);

        return new NextResponse("Task added successfully for user " + (await session).id, { status: 201 });
    } catch (error) {
        console.error("Error adding task ", error);
    }
}

export async function GET() {
    try {
        const session = await getCurrentUserOrThrow();
        const cacheKey = `tasks:${session.email}`;

        const cached = await redis.get(cacheKey);
        if (typeof cached === "string") return NextResponse.json(JSON.parse(cached));

        const userWithTasks = await db.user.findUnique({
            where: { email: (await session).email },
            include: {
                tasks: true
            }
        });

        if (!userWithTasks) return new NextResponse("User not found", { status: 404 });

        await redis.set(cacheKey, JSON.stringify(userWithTasks.tasks), { ex: 300 });

        return NextResponse.json(userWithTasks.tasks);
    } catch (error) {
        console.error("Error getting all the tasks", error);
    }
}