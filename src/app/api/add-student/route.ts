import { db } from "@/lib/db";
import { supabase } from '@/lib/supabase';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log(body)
        const { name, gender, age, academicScore, grades, friends, disrespectfull, wellBeingScore, socioEconomicsStatus, activities, email, password } = body
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
        // if (className) {
        //     const classData = await db.class.findUnique({ where: { name: String(className) }, include: { students: true } })
        //     if (!classData) {
        //         //if class does not exists create class
        //         const newClass = await db.class.create({
        //             data: {
        //                 name: String(className)
        //             }
        //         })
        //         const Student = await db.student.create({
        //             data: {
        //                 name, gender, age, grades, wellBeingScore, socioEconomicsStatus, academicScore, activities,
        //                 userId: user.id, classId: newClass.id, friends, disrespectfull
        //             }
        //         })
        //         return NextResponse.json({ message: "Student added successfully", Student, user }, { status: 201 })
        //     }

        //     //if students are more than 30
        //     if (classData?.students && classData.students.length >= 30) {
        //         return NextResponse.json({ message: "Class is full" }, { status: 400 })
        //     }

        //     //normally add student without class
        //     const Student = await db.student.create({
        //         data: {
        //             name, gender, age, grades, wellBeingScore, socioEconomicsStatus, academicScore, activities,
        //             userId: user.id, classId: classData?.id, friends, disrespectfull
        //         }
        //     })
        //     return NextResponse.json({ message: "Student added successfully", Student, user }, { status: 201 })
        // }

        const Student = await db.student.create({
            data: {
                name, gender, age, grades, wellBeingScore, socioEconomicsStatus, academicScore, activities,
                userId: user.id,friends,disrespectfull
            }
        })
        return NextResponse.json({ message: "Student added successfully", Student, user }, { status: 201 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Error while creating student" }, { status: 500 })
    }
}