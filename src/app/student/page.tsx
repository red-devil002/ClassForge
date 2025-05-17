"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";

interface StudentData {
  name: string;
  gender: string;
  age: number;
  academicScore: number;
  grades: string;
  wellBeingScore: number;
  socioEconomicsStatus: string;
  activities: string[];
  teacher: {
    name: string;
  };
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch data from an API
    const fetchStudentData = async () => {
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulated data
        setStudentData({
          name: "Alex Johnson",
          gender: "male",
          age: 15,
          academicScore: 8.2,
          grades: "A-, B+, A, B+",
          wellBeingScore: 7.8,
          socioEconomicsStatus: "Middle",
          activities: ["Basketball", "Chess Club", "Science Olympiad"],
          teacher: {
            name: "Mrs. Smith",
          },
        });
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchStudentData();
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-gray-500">Welcome back, {studentData?.name || "Student"}!</p>
        </div>

        {!isLoading && (
          <Card className="w-full sm:w-auto bg-student/5 border-student/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-student/10 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-student" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500">Your Teacher</p>
                <p className="font-medium">{studentData?.teacher.name}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gray-50 animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Academic Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{studentData?.academicScore.toFixed(1)}</div>
              <p className="text-xs text-gray-500 mt-1">
                On a scale of 1-10
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Well-being Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{studentData?.wellBeingScore.toFixed(1)}</div>
              <p className="text-xs text-gray-500 mt-1">
                On a scale of 1-10
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Age
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{studentData?.age}</div>
              <p className="text-xs text-gray-500 mt-1">
                Years old
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{studentData?.activities.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                Extracurricular activities
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-[60px] animate-pulse"></div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm font-medium">Mathematics</div>
                    <div className="text-sm font-medium">A-</div>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-student h-full rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm font-medium">Science</div>
                    <div className="text-sm font-medium">B+</div>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-student h-full rounded-full" style={{ width: "78%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm font-medium">English</div>
                    <div className="text-sm font-medium">A</div>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-student h-full rounded-full" style={{ width: "92%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm font-medium">History</div>
                    <div className="text-sm font-medium">B+</div>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-student h-full rounded-full" style={{ width: "80%" }}></div>
                  </div>
                </div>

                <div className="pt-2">
                  <a href="/student/performance" className="text-sm text-student hover:underline">
                    View detailed performance →
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Your Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2 p-3 rounded-lg border border-gray-100">
                    <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {studentData?.activities.map((activity, index) => (
                  <div key={index} className="p-3 rounded-lg border border-gray-100 hover:border-student/30 hover:bg-student/5 transition-colors">
                    <div className="font-medium mb-1">{activity}</div>
                    <p className="text-sm text-gray-600">
                      {activity === "Basketball" && "Practice on Mondays and Wednesdays"}
                      {activity === "Chess Club" && "Meets every Tuesday afternoon"}
                      {activity === "Science Olympiad" && "Preparing for regional competition"}
                    </p>
                  </div>
                ))}

                <div className="pt-2">
                  <a href="#" className="text-sm text-student hover:underline">
                    Discover new activities →
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}