import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { students } = data;

    if (!students || !Array.isArray(students)) {
      return new Response("Missing or invalid 'students' array", { status: 400 });
    }

    const updatedStudents = [];
    for (const student of students) {
      console.log(student)
      const { student_id, assigned_class } = student;

      if (!student_id || !assigned_class) continue;

      const className = `${assigned_class}`;

      // Check if class with that name exists
      let targetClass = await db.class.findUnique({
        where: { name: className }
      });

      // If not, create it
      if (!targetClass) {
        targetClass = await db.class.create({
          data: { name: className }
        });
      }

      // Assign student to that class
      const updatedStudent = await db.student.update({
        where: { id: student_id },
        data: {
          classId: targetClass.id
        }
      });

      updatedStudents.push(updatedStudent);
    }

    return Response.json({
      message: "✅ Students assigned to classes",
      updated: updatedStudents.length
    });

  } catch (error) {
    console.error("Error assigning students to classes:", error);
    return new Response("Server error", { status: 500 });
  }
}
