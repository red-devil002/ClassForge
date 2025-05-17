
import { db } from '@/lib/db';
import { Role } from '@/context/auth-context';

// User API functions
export async function getUserRole(userId: string): Promise<Role | null> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    
    return user?.role || null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
}

export async function createUser(data: {
  id: string;
  email: string;
  role: Role;
  name: string;
}) {
  try {
    const { id, email, role, name } = data;
    
    // Create user record
    const user = await db.user.create({
      data: {
        id,
        email,
        role,
      },
    });

    // Create role-specific profile
    if (role === 'TEACHER') {
      await db.teacher.create({
        data: {
          userId: id,
          name,
        },
      });
    } else if (role === 'STUDENT') {
      await db.student.create({
        data: {
          userId: id,
          name,
          gender: 'other', // Default values for required fields
          age: 0,
          academicScore: 0,
          grades: '',
          wellBeingScore: 0,
          socioEconomicsStatus: '',
          activities: "",
        },
      });
    }

    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Teacher API functions
export async function getAllTeachers() {
  try {
    return await db.teacher.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw error;
  }
}

export async function getTeacher(id: string) {
  try {
    return await db.teacher.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        students: true,
      },
    });
  } catch (error) {
    console.error('Error fetching teacher:', error);
    throw error;
  }
}

// Student API functions
export async function getAllStudents() {
  try {
    return await db.student.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
}

export async function getStudent(id: string) {
  try {
    return await db.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    throw error;
  }
}

export async function getStudentsByTeacher(teacherId: string) {
  try {
    return await db.student.findMany({
      where: {
        teacherId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching teacher students:', error);
    throw error;
  }
}

export async function createStudent(data: {
  name: string;
  gender: string;
  age: number;
  academicScore: number;
  grades: string;
  wellBeingScore: number;
  socioEconomicsStatus: string;
  activities: string;
  email: string;
  teacherId?: string;
}) {
  try {
    // Create a Supabase user with a random password
    // This would be replaced with actual Supabase API call
    const password = Math.random().toString(36).slice(-8);
    
    // In a real app, this would use Supabase Admin API to create a user
    // For now, we'll simulate the response
    const userId = `supabase-${Math.random().toString(36).substring(2, 15)}`;
    
    // Create user and student profile
    const user = await db.user.create({
      data: {
        id: userId,
        email: data.email,
        role: 'STUDENT',
      },
    });
    
    const student = await db.student.create({
      data: {
        userId: user.id,
        name: data.name,
        gender: data.gender,
        age: data.age,
        academicScore: data.academicScore,
        grades: data.grades,
        wellBeingScore: data.wellBeingScore,
        socioEconomicsStatus: data.socioEconomicsStatus,
        activities: data.activities,
        teacherId: data.teacherId,
      },
    });
    
    return student;
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
}