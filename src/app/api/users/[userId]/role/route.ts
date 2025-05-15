
import { getUserRole } from '@/lib/api-handlers';
import { NextResponse } from 'next/server';

export async function GET(request: Request, context:any) {
  try {
    const {userId} = await context.params;
    const role = await getUserRole(userId);
    
    if (!role) {
      return NextResponse.json({ message: "User role not found" }, { status: 404 });
    }
    
    return NextResponse.json({ role });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}