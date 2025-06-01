import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

const POST = async (req: Request) => {
    try {
        const session = await getServerSession();

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title, status, priority } = await req.json();
        if (!title) return new NextResponse("Title required for adding new task", { status: 400 });

        const user = await db.user.findMany({ where: { email: session.user.email } });
        if (!user) {
            return new NextResponse("User does not exist!", { status: 400 });
        }

        await db.tasks.create({
            data: {
                title,
                status,
                userId: session.user.id,
                priority
            }
        });

        return new NextResponse("Task added successfully for user " + session.user.id, { status: 201 });
    } catch (error) {
        console.error("Error adding task ", error);
    }
}

const GET = async () => {
    try {
        // if (process.env.NODE_ENV === 'development') {
        //     const testUser = await db.user.findFirst({
        //         include: { tasks: true }
        //     });

        //     if (!testUser) {
        //         return NextResponse.json({ error: 'No test user found' }, { status: 404 });
        //     }

        //     return NextResponse.json(testUser.tasks);
        // }
        const session = await getServerSession();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userWithTasks = await db.user.findUnique({
            where: { email: session.user.email },
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