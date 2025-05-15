
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request, context: any) {
    try {
        const { userId } = await context.params;
        const user = await db.user.findUnique({ where: { id: userId }, select: { role: true } });

        if (!user?.role) {
            return NextResponse.json({ message: "User role not found" }, { status: 404 });
        }

        return Response.json({ user, role: user.role });
    } catch (error: any) {
        return Response.json({ error: error.message || "Internal server error" }, { status: 500 });

    }
}