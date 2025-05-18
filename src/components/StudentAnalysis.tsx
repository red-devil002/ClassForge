"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import toast from "react-hot-toast";
import ClassGraph from "./classGraph";

// -----------------------------
// Types
// -----------------------------
type Student = {
  userId:string
  id: string;
  name: string;
  age: number;
  grades: string; 
  gender: string;
  friends: string;
  disrespectfull: string;
};


type Class = {
  id: string;
  name: string;
  students: Student[];
};

// -----------------------------
// Semicircle Chart
// -----------------------------
const SemicircleChart = ({ label, value, total, color = "#3b82f6" }: any) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const dashArray = 2 * Math.PI * 40;
  const dashOffset = dashArray * (1 - percentage / 100);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-28 w-56">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <path d="M10,50 A40,40 0 1,1 90,50" fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <path
            d="M10,50 A40,40 0 1,1 90,50"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
          <text
            x="50"
            y="35"
            textAnchor="middle"
            fill="currentColor"
            fontSize={16}
            fontWeight={700}
          >
            {percentage}%
          </text>
        </svg>
      </div>
      <span className="mt-1 text-sm font-medium">{label}</span>
    </div>
  );
};

// -----------------------------
// Main Component
// -----------------------------
export default function StudentAnalysis() {
  const [studentClass, setStudentClass] = useState<Class | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Fetch class and filter for current user
  useEffect(() => {
    const fetchClass = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/classes/${user?.id}`);
        const data = await res.json();

        if (res.status === 200) {
          const student = data.classData.students.find((s: Student) => s.userId === user?.id);
          setStudentClass(data.classData);
          setSelectedStudent(student || null);
        } else {
          toast.error(data.message);
        }
      } catch {
        toast.error("Failed to fetch class data.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) fetchClass();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!studentClass || !selectedStudent) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md text-center">
        <h3 className="text-lg font-medium text-gray-800 mb-2">No Class Assigned</h3>
        <p className="text-gray-600">You are not assigned to any class.</p>
      </div>
    );
  }

  const totalOthers = studentClass.students.length - 1;
  const parseList = (val: string | null | undefined) =>
    (val || "").split(",").map(name => name.trim()).filter(Boolean);


  const friendCount = parseList(selectedStudent.friends).length;
  const disrespectfulList = parseList(selectedStudent.disrespectfull);

  const disrespectfulCount = disrespectfulList.length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow p-6">
        <h3 className="text-2xl font-bold text-blue-900 mb-2">{studentClass.name}</h3>
        <p className="text-blue-700">Total Students: {studentClass.students.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SemicircleChart label="Friends" value={friendCount} total={totalOthers} />
        <SemicircleChart label="Disrespectful" value={disrespectfulCount} total={totalOthers} color="#ef4444" />
      </div>

      {/* Graph Container */}
      <div className="w-full h-full p-4 rounded-xl relative">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Class Relationship Graph</h4>
        <ClassGraph students={studentClass.students} />
      </div>
    </div>
  );
}
