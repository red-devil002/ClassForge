
import { createUser } from '@/lib/api-handlers';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, email, role, name } = data;

    if (!id || !email || !role || !name) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await createUser({ id, email, role, name });
    return Response.json({ message:"User created",user },{status: 200});
  } catch (error: any) {
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}