import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const totalStudents = await db.student.count();
    const totalTeachers = await db.teacher.count();
    const totalClasses = await db.class.count();

    // Students per class for chart
    const studentsPerClass = await db.class.findMany({
      include: {
        students: true,
      },
    });

    const studentDistribution = studentsPerClass.map((cls) => ({
      className: cls.name,
      count: cls.students.length,
    }));

    // Gender distribution of teachers
    const teacherGenderDist = await db.teacher.groupBy({
      by: ['gender'],
      _count: true,
    });

    const genderDistribution = teacherGenderDist.map((t) => ({
      gender: t.gender ?? 'Unknown',
      count: t._count,
    }));

    return NextResponse.json({
      totalStudents,
      totalTeachers,
      totalClasses,
      studentDistribution,
      genderDistribution,
    });
  } catch (error) {
    console.error('[ADMIN_DASHBOARD_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
