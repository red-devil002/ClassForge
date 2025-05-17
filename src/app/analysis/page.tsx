"use client";

import TeacherAnalysis from "@/components/TeacherAnalysis";
import StudentAnalysis from "@/components/StudentAnalysis";
import { useAuth } from "@/context/auth-context";

export default function ClassGraphPage() {
  const { role, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;

  if (role === "TEACHER") return <TeacherAnalysis />;
  if (role === "STUDENT") return <StudentAnalysis />;

  return <p className="text-center mt-10">Access restricted to teachers or students only.</p>;
}
