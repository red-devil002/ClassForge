import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: any) {
    try {
        const { userId } = await context.params;
        const student = await db.student.findUnique({ where: { userId: userId }, include: { class: { include: { students: true } } } });
        if (!student?.class) return NextResponse.json({ message: "You are not assigned to any class" }, { status: 400 })
        console.log("student: ", !student?.class)
        const classData = student.class
        return NextResponse.json({ message: "Found class", classData }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error while getting class", error }, { status: 500 });
    }
}