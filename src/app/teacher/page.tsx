
"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

interface TeacherDashboardSummary {
  totalStudents: number;
  averageAcademicScore: number;
  averageWellBeingScore: number;
  upcomingActivities: number;
}

export default function TeacherDashboard() {
  const [summary, setSummary] = useState<TeacherDashboardSummary>({
    totalStudents: 0,
    averageAcademicScore: 0,
    averageWellBeingScore: 0,
    upcomingActivities: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch data from an API
    const fetchSummaryData = async () => {
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulated data
        setSummary({
          totalStudents: 28,
          averageAcademicScore: 7.6,
          averageWellBeingScore: 8.4,
          upcomingActivities: 3,
        });
      } catch (error) {
        console.error("Error fetching summary data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's an overview of your class.</p>
        
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
                  Total Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary.totalStudents}</div>
                <p className="text-xs text-gray-500 mt-1">
                  Students in your class
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Avg. Academic Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary.averageAcademicScore.toFixed(1)}</div>
                <p className="text-xs text-gray-500 mt-1">
                  On a scale of 1-10
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Avg. Well-being Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary.averageWellBeingScore.toFixed(1)}</div>
                <p className="text-xs text-gray-500 mt-1">
                  On a scale of 1-10
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Upcoming Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary.upcomingActivities}</div>
                <p className="text-xs text-gray-500 mt-1">
                  Scheduled this week
                </p>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student List Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Students</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-student/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-student" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Alex Johnson</p>
                      <p className="text-sm text-gray-500">Academic Score: 8.2</p>
                    </div>
                    <div className="ml-auto text-xs text-gray-500">
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Active
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-student/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-student" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Maria Garcia</p>
                      <p className="text-sm text-gray-500">Academic Score: 9.1</p>
                    </div>
                    <div className="ml-auto text-xs text-gray-500">
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Active
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-student/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-student" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">David Lee</p>
                      <p className="text-sm text-gray-500">Academic Score: 7.8</p>
                    </div>
                    <div className="ml-auto text-xs text-gray-500">
                      <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        Needs Help
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-student/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-student" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Sarah Williams</p>
                      <p className="text-sm text-gray-500">Academic Score: 8.5</p>
                    </div>
                    <div className="ml-auto text-xs text-gray-500">
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Active
                      </span>
                    </div>
                  </div>
                </>
              )}
              
              <div className="pt-2">
                <a href="/teacher/students" className="text-sm text-teacher hover:underline">
                  View all students →
                </a>
              </div>
            </CardContent>
          </Card>
          
          {/* Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Activities</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2 p-3 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-center">
                        <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-[80px] animate-pulse"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg border border-gray-100 hover:border-teacher/30 hover:bg-teacher/5 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium">Math Quiz</div>
                      <div className="text-xs text-gray-500">Tomorrow, 10:00 AM</div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Chapter 5 assessment on algebra fundamentals
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-gray-100 hover:border-teacher/30 hover:bg-teacher/5 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium">Science Project Due</div>
                      <div className="text-xs text-gray-500">Dec 18, 3:00 PM</div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Renewable energy demonstration projects
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-gray-100 hover:border-teacher/30 hover:bg-teacher/5 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium">Parent-Teacher Meeting</div>
                      <div className="text-xs text-gray-500">Dec 20, All Day</div>
                    </div>
                    <p className="text-sm text-gray-600">
                      End of semester progress discussions
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <a href="#" className="text-sm text-teacher hover:underline">
                      Add new activity →
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}