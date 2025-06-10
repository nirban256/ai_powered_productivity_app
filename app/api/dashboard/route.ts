import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserOrThrow } from "@/lib/get-user";

const GET = async (req: Request) => {
    const session = await getCurrentUserOrThrow();

    const userWithEvents = await db.user.findUnique({
        where: { email: (await session).email },
        include: {
            events: true,
            notes: true,
            tasks: true
        }
    });

    if (!userWithEvents) return new NextResponse("User not found", { status: 404 });

    const task = userWithEvents.tasks.filter((t) => t.status === false && t.priority === "severe");
    const note = userWithEvents.notes;
    const event = userWithEvents.events.filter((e) => e.date.getTime() > Date.now());

    const tasks = await db.tasks.findMany({
        where: {
            userId: session.id,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 3,
    });

    const notes = await db.notes.findMany({
        where: {
            userId: session.id,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 3,
    });

    const events = await db.events.findMany({
        where: {
            userId: session.id,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 3,
    });

    const data = {
        taskLength: task.length,
        noteLength: note.length,
        eventLength: event.length,
        tasks: tasks,
        notes: notes,
        events: events
    }

    return NextResponse.json(data);
}

export { GET };