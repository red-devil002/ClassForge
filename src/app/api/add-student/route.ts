import { createUser } from "@/lib/api-handlers";
import { db } from "@/lib/db";
import { supabase } from '@/lib/supabase';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log(body)
        const { name, gender, age, academicScore, grades, wellBeingScore, socioEconomicsStatus, activities, email, password } = body
        if (!email || !password || !name || !gender || !String(age) || !grades || !wellBeingScore || !socioEconomicsStatus || !activities) {
            return new Response("Missing required fields", { status: 400 })
        }
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('Failed to create user');

        const user = await db.user.create({
            data: {
                id: authData.user.id,
                email,
                role: "STUDENT",
            },
        });

        if (!user) {
            return NextResponse.json({ message: "Error while creating user" }, { status: 500 })
        }
        const activitiesArray = body.activities.split(",").map((activity: string) => activity.trim());
        const Student = await db.student.create({
            data: {
                name, gender, age, grades, wellBeingScore, socioEconomicsStatus, academicScore, activities: activitiesArray,
                userId: user.id
            }
        })
        return NextResponse.json({ message: "Student added successfully", Student, user }, { status: 201 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Error while creating student" }, { status: 500 })
    }
}