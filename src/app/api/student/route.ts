import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const student = await db.student.findUnique({
            where: { userId: userId },
            include: { class: true },
        });

        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        const classmates = student.classId
            ? await db.student.findMany({
                where: { classId: student.classId },
                select: { name: true, academicScore: true, wellBeingScore: true },
            })
            : [];

        const academicScores = classmates.map((s) => s.academicScore);
        const wellBeingScores = classmates.map((s) => s.wellBeingScore);

        return NextResponse.json({
            student: {
                name: student.name,
                gender: student.gender,
                age: student.age,
                academicScore: student.academicScore,
                wellBeingScore: student.wellBeingScore,
                class: student.class?.name || 'No Class Assigned',
            },
            classmates,
            academicScores,
            wellBeingScores,
        });
    } catch (error) {
        console.error('[STUDENT_DASHBOARD_API_ERROR]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
