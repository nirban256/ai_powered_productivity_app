import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserOrThrow } from "@/lib/get-user";
import { redis } from "@/lib/redis";

const GET = async (req: Request) => {
    const session = await getCurrentUserOrThrow();
    const cacheKey = `events:${session.email}`;

    const cached = await redis.get(cacheKey);
    if (typeof cached === "string") return NextResponse.json(JSON.parse(cached));

    const userWithEvents = await db.user.findUnique({
        where: { email: session.email },
        include: {
            events: true
        }
    });

    if (!userWithEvents) return new NextResponse("User not found", { status: 404 });

    await redis.set(cacheKey, JSON.stringify(userWithEvents.events), { ex: 300 });

    return NextResponse.json(userWithEvents.events);
}

const POST = async (req: Request) => {
    try {
        const session = await getCurrentUserOrThrow();
        const cacheKey = `events:${session.email}`;

        const { title, date } = await req.json();
        if (!title || !date) return new NextResponse("Invalid data for events", { status: 400 });

        const parseDate = new Date(date);
        if (isNaN(parseDate.getTime())) return new NextResponse("Invalid date format", { status: 400 });

        const today = new Date();
        today.getTime();
        if (parseDate.getTime() <= today.getTime()) {
            return new NextResponse("Date and time cannot be before than current date or time", { status: 400 });
        }

        const user = await db.user.findMany({ where: { email: session.email } });
        if (!user) {
            return new NextResponse("User does not exist!", { status: 400 });
        }

        await db.events.create({
            data: {
                title,
                date: parseDate,
                userId: session.id
            }
        });

        await redis.del(cacheKey);

        return new NextResponse("Event added successfully", { status: 200 });
    } catch (error) {
        console.error("Error adding events", error);
    }
}

export { GET, POST };