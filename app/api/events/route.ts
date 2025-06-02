import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserOrThrow } from "@/lib/get-user";

const GET = async (req: Request) => {
    const session = getCurrentUserOrThrow();

    const userWithEvents = await db.user.findUnique({
        where: { email: (await session).email },
        include: {
            events: true
        }
    });

    if (!userWithEvents) return new NextResponse("User not found", { status: 404 });

    return NextResponse.json(userWithEvents.events);
}

const POST = async (req: Request) => {
    try {
        const session = getCurrentUserOrThrow();

        const { title, date } = await req.json();
        if (!title || !date) return new NextResponse("Invalid data for events", { status: 400 });

        const parseDate = new Date(date);
        if (isNaN(parseDate.getTime())) return new NextResponse("Invalid date format", { status: 400 });

        const today = new Date();
        today.getTime();
        if (parseDate.getTime() <= today.getTime()) {
            return new NextResponse("Date and time cannot be before than current date or time", { status: 400 });
        }

        const user = await db.user.findMany({ where: { email: (await session).email } });
        if (!user) {
            return new NextResponse("User does not exist!", { status: 400 });
        }

        await db.events.create({
            data: {
                title,
                date: parseDate,
                userId: (await session).id
            }
        });

        return new NextResponse("Event added successfully", { status: 200 });
    } catch (error) {
        console.error("Error adding events", error);
    }
}

export { GET, POST };