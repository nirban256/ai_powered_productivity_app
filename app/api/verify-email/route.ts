import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) return new NextResponse('Missing token', { status: 400 });

    const record = await db.verificationToken.findUnique({ where: { token } });
    if (!record || record.expires < new Date()) {
        return new NextResponse('Invalid or expired token', { status: 400 })
    }

    await db.user.update({
        where: { email: record.email },
        data: {
            emailVerified: new Date()
        },
    });

    await db.verificationToken.delete({ where: { token } })

    return NextResponse.redirect('/auth/signin');
}