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

    const task = userWithEvents.tasks.filter((s) => s.status === false && s.priority === "severe");
    const note = userWithEvents.notes;
    const event = userWithEvents.events.filter((e) => e.date.getTime() > Date.now());

    const data = {
        tasks: task.length,
        notes: note.length,
        events: event.length
    }

    return NextResponse.json(data);
}

export { GET };