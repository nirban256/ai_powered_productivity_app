import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextResponse } from "next/server";

const getCurrentUserOrThrow = async () => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new NextResponse("Unauthorized", { status: 401 });
    }

    return session.user;
};

export { getCurrentUserOrThrow };