
"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardSummary {
  totalTeachers: number;
  totalStudents: number;
  averageAcademicScore: number;
  averageWellBeingScore: number;
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState<DashboardSummary>({
    totalTeachers: 0,
    totalStudents: 0,
    averageAcademicScore: 0,
    averageWellBeingScore: 0,
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
          totalTeachers: 12,
          totalStudents: 248,
          averageAcademicScore: 7.8,
          averageWellBeingScore: 8.2,
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-500">Welcome back! Here's an overview of the platform.</p>

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
                Total Teachers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summary.totalTeachers}</div>
              <p className="text-xs text-gray-500 mt-1">
                Active educators in the system
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summary.totalStudents}</div>
              <p className="text-xs text-gray-500 mt-1">
                Enrolled students across all classes
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
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
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
                  <div className="h-8 w-8 rounded-full bg-admin/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-admin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">New teacher added</p>
                    <p className="text-sm text-gray-500">Jane Smith - Mathematics</p>
                  </div>
                  <div className="ml-auto text-xs text-gray-500">
                    2h ago
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-teacher/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teacher" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Data updated</p>
                    <p className="text-sm text-gray-500">Academic scores for Class 5B</p>
                  </div>
                  <div className="ml-auto text-xs text-gray-500">
                    1d ago
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-student/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-student" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">New students enrolled</p>
                    <p className="text-sm text-gray-500">15 new students added</p>
                  </div>
                  <div className="ml-auto text-xs text-gray-500">
                    3d ago
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-admin/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-admin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">System update</p>
                    <p className="text-sm text-gray-500">New features added to platform</p>
                  </div>
                  <div className="ml-auto text-xs text-gray-500">
                    1w ago
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
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
                    <div className="text-sm font-medium">Academic Achievement</div>
                    <div className="text-sm font-medium">78%</div>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-admin h-full rounded-full" style={{ width: "78%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm font-medium">Well-being Score</div>
                    <div className="text-sm font-medium">82%</div>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-teacher h-full rounded-full" style={{ width: "82%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm font-medium">Activity Participation</div>
                    <div className="text-sm font-medium">65%</div>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-student h-full rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm font-medium">Teacher Engagement</div>
                    <div className="text-sm font-medium">92%</div>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: "92%" }}></div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}