import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserOrThrow } from "@/lib/get-user";
import { redis } from "@/lib/redis";

export async function GET(
    req: Request,
    context: { params: { id: string } }
) {
    try {
        const session = await getCurrentUserOrThrow();

        const userWithEvents = await db.user.findUnique({
            where: { id: session.id },
            include: { events: true }
        });

        if (!userWithEvents) {
            return new NextResponse("User not found", { status: 404 });
        }

        const { id } = context.params;

        const event = await db.events.findUnique({
            where: {
                userId: session.id,
                id: id
            }
        });

        if (!event) {
            return new NextResponse("Invalid id", { status: 404 });
        }

        return NextResponse.json(event);
    } catch (error) {
        console.error("Error fetching the event by id", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getCurrentUserOrThrow();
        const cacheKey = `events:${session.email}`;

        const userWithEvents = await db.user.findUnique({
            where: { id: session.id },
            include: {
                events: true
            }
        });
        if (!userWithEvents) return new NextResponse("User not found", { status: 404 });

        const { title, date } = await req.json();
        if (!title || !date) return new NextResponse("Invalid data for events", { status: 400 });

        const parseDate = new Date(date);
        if (isNaN(parseDate.getTime())) return new NextResponse("Invalid date format", { status: 400 });

        const today = new Date();
        today.getTime();
        if (parseDate.getTime() <= today.getTime()) {
            return new NextResponse("Date and time cannot be before than current date or time", { status: 400 });
        }

        const { id } = await params;
        const event = await db.events.findUnique({ where: { userId: session.id, id: id } });
        if (!event) return new NextResponse("Invalid id", { status: 404 });

        await db.events.update({
            where: { id: id },
            data: {
                title,
                date: parseDate,
                userId: session.id
            }
        });

        await redis.del(cacheKey);

        return new NextResponse("Event with id " + id + " updated successfully", { status: 200 });
    } catch (error) {
        console.error("Error updating events with id", error);
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getCurrentUserOrThrow();
        const cacheKey = `events:${session.email}`;

        const userWithEvents = await db.user.findUnique({
            where: { id: session.id },
            include: {
                events: true
            }
        });
        if (!userWithEvents) return new NextResponse("User not found", { status: 404 });

        const { id } = await params;
        const event = await db.events.findUnique({ where: { userId: session.id, id: id } });
        if (!event) return new NextResponse("Invalid id", { status: 404 });

        await db.events.delete({ where: { userId: session.id, id: id } });

        await redis.del(cacheKey);

        return new NextResponse("Event with " + id + " deleted successfully", { status: 200 });
    } catch (error) {
        console.error("Error deleting task", error);
    }
}
