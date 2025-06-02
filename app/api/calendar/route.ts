import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserOrThrow } from "@/lib/get-user";

const GET = async (req: Request) => {
    const session = getCurrentUserOrThrow();


}

export { GET };