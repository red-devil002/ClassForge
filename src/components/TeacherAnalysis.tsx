"use client";

import { useEffect, useState } from "react";
import ClassGraph from "./classGraph";
import SemicircleChart from "./SemicircleChart";

type Student = {
  id: string;
  name: string;
  age: number;
  grades: string;  // You can change this to number[] or object if needed
  gender: string;
  friends: string;
  disrespectfull: string;
};


type Class = {
  id: string;
  name: string;
  students: Student[];
};

export default function TeacherAnalysis() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [studentsLength, setStudentsLength] = useState(0);
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/classes");
        const data = await res.json();
        setClasses(data.classes || []);
        setStudentsLength(data.studentsLength || 0);
      } catch (error) {
        console.error("Failed to load classes:", error);
      }
    };
    fetchClasses();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold text-blue-900">Your Class Graphs</h2>
        <p className="text-blue-700 mt-1">
          Visual breakdown of student relationships across your classes.
        </p>
      </div>

      {classes.map((cls) => {
        const students = cls.students;
        const totalStudents = students.length;

        // Create a Set of IDs in this class
        const studentIdsInClass = new Set(students.map((s) => s.name));
        console.log("studentIdsInClass: ", studentIdsInClass)
        // Calculate total in-class friends
        const totalInClassFriends = students.reduce((acc, student) => {
          const friends = student.friends?.split(",").map(f => f.trim()).filter(Boolean) || [];
          console.log("friends: ", friends)
          const validFriends = friends.filter(f => studentIdsInClass.has(f));
          return acc + validFriends.length;
        }, 0);

        // Calculate total in-class disrespectful peers
        const totalInClassDisrespect = students.reduce((acc, student) => {
          const disrespectful = student.disrespectfull?.split(",").map(f => f.trim()).filter(Boolean) || [];
          const validDisrespectful = disrespectful.filter(f => studentIdsInClass.has(f));
          return acc + validDisrespectful.length;
        }, 0);

        // Averages per student
        const averageFriends = totalStudents > 0 ? totalInClassFriends / totalStudents : 0;
        const averageDisrespect = totalStudents > 0 ? totalInClassDisrespect / totalStudents : 0;

        return (
          <div key={cls.id} className="bg-white rounded-xl shadow-md p-6 space-y-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{cls.name}</h3>
                <p className="text-sm text-gray-600">Total Students: {students.length}</p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 mt-4">
              {/* Graph */}
              <div className="lg:w-1/2 w-full min-h-[300px]">
                <h4 className="text-md font-semibold text-gray-700 mb-2">Relationship Graph</h4>
                <ClassGraph students={students} />
              </div>

              {/* Charts */}
              <div className="lg:w-1/2 w-full flex flex-col justify-center space-y-6">
                <div className="w-full min-h-[180px]">
                  <SemicircleChart
                    label="Friends"
                    value={Number(averageFriends.toFixed(1))} // Average friends per student
                    total={totalStudents}
                    percentage={(averageFriends * 10).toFixed(0)} // Optional: Adjusted percentage scale
                  />
                </div>
                <div className="w-full min-h-[180px]">
                  <SemicircleChart
                    label="Disrespectful"
                    value={Number(averageDisrespect.toFixed(1))}
                    total={totalStudents}
                    percentage={(averageDisrespect * 10).toFixed(0)} // Optional: Adjusted scale
                    color="#ef4444"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}


      {classes.length === 0 && (
        <div className="text-center text-gray-600 py-20">
          <p className="text-lg font-medium">No classes found.</p>
          <p>Please ensure you have created classes and added students.</p>
        </div>
      )}
    </div>
  );
}
