import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const classes = await db.class.findMany({ include: { students: true } });
        const studentsLength = classes.reduce((total, classData) => total + classData.students.length, 0);
        return NextResponse.json({ message: "Found class", classes,studentsLength }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error while getting classes", error }, { status: 500 });
    }
}