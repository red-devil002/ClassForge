import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Student } from '@prisma/client';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const teacher = await db.teacher.findUnique({
            where: { userId },
            select: { name: true, id: true },
        });
        if (!teacher) {
            return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
        }

        const students = await db.student.findMany({});
        const totalStudents = students.length;

        const averageAcademicScore =
            totalStudents > 0
                ? students.reduce((acc, student) => acc + student.academicScore, 0) / totalStudents
                : 0;
        const averageWellBeingScore =
            totalStudents > 0
                ? students.reduce((acc, student) => acc + student.wellBeingScore, 0) / totalStudents
                : 0;
        // Friends vs Enemies (using friends and disrespectfull string count)
        const friendCounts = students.map((s) => (s.friends?.split(',').filter(Boolean).length || 0));
        const enemyCounts = students.map((s) => (s.disrespectfull?.split(',').filter(Boolean).length || 0));
        const totalFriends = friendCounts.reduce((a, b) => a + b, 0);
        const totalEnemies = enemyCounts.reduce((a, b) => a + b, 0);
        const socialGraph = [
            { label: 'Friends', count: totalFriends },
            { label: 'Enemies', count: totalEnemies },
        ];
        const wellBeingDistribution = [
            { scoreRange: '0-2', count: students.filter((s) => s.wellBeingScore <= 2).length },
            { scoreRange: '3-5', count: students.filter((s) => s.wellBeingScore > 2 && s.wellBeingScore <= 5).length },
            { scoreRange: '6-8', count: students.filter((s) => s.wellBeingScore > 5 && s.wellBeingScore <= 8).length },
            { scoreRange: '9-10', count: students.filter((s) => s.wellBeingScore > 8).length },
        ];
        const recentStudents = students
            .slice(0, 3)
            .map((student: Student) => ({
                name: student.name,
                academicScore: student.academicScore,
                status: student.academicScore >= 50 ? 'Active' : 'Needs Help',
            }));

        return NextResponse.json({
            name: teacher.name,
            totalStudents,
            averageAcademicScore,
            averageWellBeingScore,
            wellBeingDistribution,
            socialGraph,
            recentStudents,
        });
    } catch (error) {
        console.error('[DASHBOARD_API_ERROR]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}