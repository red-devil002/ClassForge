// 'use client';

// import { useEffect, useState } from 'react';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { useAuth } from '@/context/auth-context';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// type Classmate = {
//   name: string;
//   academicScore: number;
//   wellBeingScore: number;
// };

// type DashboardData = {
//   student: {
//     name: string;
//     gender: string | null;
//     age: number | null;
//     academicScore: number;
//     wellBeingScore: number;
//     class: string;
//   };
//   classmates: Classmate[];
//   academicScores: number[];
//   wellBeingScores: number[];
// };

// export default function StudentDashboard() {
//   const {user} = useAuth();
//   const [data, setData] = useState<DashboardData | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (user?.id) {
//         const res = await fetch(`/api/student?userId=${user.id}`);
//         const json = await res.json();
//         setData(json);
//       }
//     };

//     fetchData();
//   }, [user]);

//   if (!data) {
//     return <div className="p-4">Loading...</div>;
//   }

//   const { student, classmates, academicScores, wellBeingScores } = data;

//   return (
//     <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
//       <Card className="col-span-1">
//         <CardHeader>
//           <CardTitle>Welcome, {student.name}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p>Gender: {student.gender || 'N/A'}</p>
//           <p>Age: {student.age || 'N/A'}</p>
//           <p>Class: {student.class}</p>
//           <p>Academic Score: {student.academicScore}</p>
//           <p>Well-Being Score: {student.wellBeingScore}</p>
//         </CardContent>
//       </Card>

//       <Card className="col-span-1 md:col-span-2">
//         <CardHeader>
//           <CardTitle>Classmates</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ul className="space-y-2">
//             {classmates.map((mate, index) => (
//               <li key={index} className="flex justify-between items-center">
//                 <span>{mate.name}</span>
//                 <span>Academic: {mate.academicScore}, Well-Being: {mate.wellBeingScore}</span>
//               </li>
//             ))}
//           </ul>
//         </CardContent>
//       </Card>

//       <Card className="col-span-1 md:col-span-2">
//         <CardHeader>
//           <CardTitle>Academic Scores</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Bar
//             data={{
//               labels: classmates.map((mate) => mate.name),
//               datasets: [
//                 {
//                   label: 'Academic Score',
//                   data: academicScores,
//                   backgroundColor: '#3b82f6',
//                 },
//               ],
//             }}
//             options={{ responsive: true, plugins: { legend: { display: false } } }}
//           />
//         </CardContent>
//       </Card>

//       <Card className="col-span-1 md:col-span-2">
//         <CardHeader>
//           <CardTitle>Well-Being Scores</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Bar
//             data={{
//               labels: classmates.map((mate) => mate.name),
//               datasets: [
//                 {
//                   label: 'Well-Being Score',
//                   data: wellBeingScores,
//                   backgroundColor: '#10b981',
//                 },
//               ],
//             }}
//             options={{ responsive: true, plugins: { legend: { display: false } } }}
//           />
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bar, Radar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAuth } from '@/context/auth-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpenIcon, HeartIcon, UsersIcon, TrendingUpIcon } from 'lucide-react';

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// TypeScript types
type Classmate = {
  name: string;
  academicScore: number;
  wellBeingScore: number;
};

type DashboardData = {
  student: {
    name: string;
    gender: string | null;
    age: number | null;
    academicScore: number;
    wellBeingScore: number;
    class: string;
  };
  classmates: Classmate[];
  academicScores: number[];
  wellBeingScores: number[];
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const res = await fetch(`/api/student?userId=${user.id}`);

          if (!res.ok) {
            throw new Error(`Failed to fetch data: ${res.status}`);
          }

          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 p-6 rounded-lg max-w-md">
          <h2 className="text-red-800 text-lg font-semibold mb-2">Unable to load dashboard</h2>
          <p className="text-red-700">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  const { student, classmates, academicScores, wellBeingScores } = data;

  // Calculate statistics and rankings
  const avgAcademic = academicScores.reduce((sum, score) => sum + score, 0) / academicScores.length;
  const avgWellbeing = wellBeingScores.reduce((sum, score) => sum + score, 0) / wellBeingScores.length;

  const academicRank = academicScores
    .concat(student.academicScore)
    .sort((a, b) => b - a)
    .indexOf(student.academicScore) + 1;

  const wellbeingRank = wellBeingScores
    .concat(student.wellBeingScore)
    .sort((a, b) => b - a)
    .indexOf(student.wellBeingScore) + 1;

  // Prepare data for charts
  const allNames = classmates.map(c => c.name);

  // For individual comparison chart (Radar)
  const radarData = {
    labels: ['Academic Score', 'Well-being Score'],
    datasets: [
      {
        label: student.name,
        data: [student.academicScore, student.wellBeingScore],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
      {
        label: 'Class Average',
        data: [avgAcademic, avgWellbeing],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 2,
      }
    ]
  };

  // For distribution chart (Doughnut)
  const academicDistribution = {
    labels: ['90-100', '80-89', '70-79', '60-69', 'Below 60'],
    datasets: [{
      data: [
        academicScores.filter(s => s >= 90).length,
        academicScores.filter(s => s >= 80 && s < 90).length,
        academicScores.filter(s => s >= 70 && s < 80).length,
        academicScores.filter(s => s >= 60 && s < 70).length,
        academicScores.filter(s => s < 60).length
      ],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(255, 99, 132, 0.8)'
      ]
    }]
  };

  // Get score status based on comparison to average
  const getScoreStatus = (score:any, avg:any) => {
    const diff = score - avg;
    if (diff >= 10) return { text: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (diff >= 5) return { text: 'Above Average', color: 'bg-blue-100 text-blue-800' };
    if (diff >= -5) return { text: 'Average', color: 'bg-gray-100 text-gray-800' };
    if (diff >= -10) return { text: 'Below Average', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };

  const academicStatus = getScoreStatus(student.academicScore, avgAcademic);
  const wellbeingStatus = getScoreStatus(student.wellBeingScore, avgWellbeing);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {student.name}</h1>
            <p className="text-blue-100 mt-1">Class: {student.class}</p>
          </div>
          <div className="flex space-x-3">
            <div className="text-center bg-white bg-opacity-20 p-3 rounded-lg">
              <p className="text-sm text-blue-100">Academic Rank</p>
              <p className="text-2xl font-bold">{academicRank}/{academicScores.length + 1}</p>
            </div>
            <div className="text-center bg-white bg-opacity-20 p-3 rounded-lg">
              <p className="text-sm text-blue-100">Well-being Rank</p>
              <p className="text-2xl font-bold">{wellbeingRank}/{wellBeingScores.length + 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Student Profile */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UsersIcon className="mr-2 h-5 w-5" />
                Student Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl">
                  {student.name.charAt(0)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Gender:</span>
                  <span className="font-medium">{student.gender || 'Not specified'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Age:</span>
                  <span className="font-medium">{student.age || 'Not specified'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Class:</span>
                  <span className="font-medium">{student.class}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Academic Score</span>
                      <Badge className={academicStatus.color}>{academicStatus.text}</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${student.academicScore}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>{student.academicScore}/100</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Well-being Score</span>
                      <Badge className={wellbeingStatus.color}>{wellbeingStatus.text}</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{ width: `${student.wellBeingScore}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>{student.wellBeingScore}/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUpIcon className="mr-2 h-5 w-5" />
                Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-60">
                <Radar
                  data={radarData}
                  options={{
                    scales: {
                      r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          stepSize: 20
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    },
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>This chart shows how your scores compare to the class average.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Performance Charts & Classmates */}
        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="academic">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="academic" className="flex items-center">
                  <BookOpenIcon className="w-4 h-4 mr-2" />
                  Academic Performance
                </TabsTrigger>
                <TabsTrigger value="wellbeing" className="flex items-center">
                  <HeartIcon className="w-4 h-4 mr-2" />
                  Well-being
                </TabsTrigger>
                <TabsTrigger value="classmates" className="flex items-center">
                  <UsersIcon className="w-4 h-4 mr-2" />
                  Classmates
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="academic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Academic Performance</CardTitle>
                    <CardDescription>
                      Your score: {student.academicScore}/100 (Rank: {academicRank})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Bar
                        data={{
                          labels: ['You', ...allNames],
                          datasets: [
                            {
                              label: 'Academic Score',
                              data: [student.academicScore, ...academicScores],
                              backgroundColor: (context) => {
                                const index = context.dataIndex;
                                return index === 0 ? 'rgba(59, 130, 246, 0.8)' : 'rgba(156, 163, 175, 0.5)';
                              },
                              borderWidth: 1,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 100,
                              title: {
                                display: true,
                                text: 'Score'
                              }
                            },
                            x: {
                              ticks: {
                                autoSkip: true,
                                maxRotation: 45,
                                minRotation: 45
                              }
                            }
                          },
                          plugins: {
                            legend: { display: false }
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Class Distribution</CardTitle>
                    <CardDescription>
                      Academic score ranges across the class
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center">
                      <Doughnut
                        data={academicDistribution}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Academic Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-700">Your Score</h3>
                      <p className="text-3xl font-bold text-blue-800">{student.academicScore}</p>
                      <p className="text-sm text-blue-600 mt-1">
                        {student.academicScore > avgAcademic
                          ? `${(student.academicScore - avgAcademic).toFixed(1)} points above average`
                          : `${(avgAcademic - student.academicScore).toFixed(1)} points below average`}
                      </p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-700">Class Average</h3>
                      <p className="text-3xl font-bold text-purple-800">{avgAcademic.toFixed(1)}</p>
                      <p className="text-sm text-purple-600 mt-1">
                        Out of {academicScores.length + 1} students
                      </p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-700">Class Highest</h3>
                      <p className="text-3xl font-bold text-green-800">
                        {Math.max(...academicScores, student.academicScore)}
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        {Math.max(...academicScores, student.academicScore) === student.academicScore
                          ? "That's you! Great job!"
                          : "Keep working to reach the top!"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wellbeing" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Well-being Score</CardTitle>
                    <CardDescription>
                      Your score: {student.wellBeingScore}/100 (Rank: {wellbeingRank})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Bar
                        data={{
                          labels: ['You', ...allNames],
                          datasets: [
                            {
                              label: 'Well-being Score',
                              data: [student.wellBeingScore, ...wellBeingScores],
                              backgroundColor: (context) => {
                                const index = context.dataIndex;
                                return index === 0 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(156, 163, 175, 0.5)';
                              },
                              borderWidth: 1,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 100,
                              title: {
                                display: true,
                                text: 'Score'
                              }
                            },
                            x: {
                              ticks: {
                                autoSkip: true,
                                maxRotation: 45,
                                minRotation: 45
                              }
                            }
                          },
                          plugins: {
                            legend: { display: false }
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Well-being Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-700">Your Well-being</h3>
                        <p className="text-3xl font-bold text-green-800">{student.wellBeingScore}</p>
                        <p className="text-sm text-green-600 mt-1">
                          {student.wellBeingScore > avgWellbeing
                            ? `${(student.wellBeingScore - avgWellbeing).toFixed(1)} points above average`
                            : `${(avgWellbeing - student.wellBeingScore).toFixed(1)} points below average`}
                        </p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-700">Class Average</h3>
                        <p className="text-3xl font-bold text-blue-800">{avgWellbeing.toFixed(1)}</p>
                        <p className="text-sm text-blue-600 mt-1">
                          Out of {wellBeingScores.length + 1} students
                        </p>
                      </div>

                      <div className="bg-teal-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-teal-700">Balance Check</h3>
                        <div className="flex items-center mt-2">
                          <span className="text-sm text-teal-600">Academic</span>
                          <div className="mx-2 flex-1 h-2 bg-gray-200 rounded-full">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${student.academicScore}%` }}></div>
                          </div>
                          <span className="text-sm text-teal-600">{student.academicScore}%</span>
                        </div>
                        <div className="flex items-center mt-2">
                          <span className="text-sm text-teal-600">Well-being</span>
                          <div className="mx-2 flex-1 h-2 bg-gray-200 rounded-full">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${student.wellBeingScore}%` }}></div>
                          </div>
                          <span className="text-sm text-teal-600">{student.wellBeingScore}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="classmates">
              <Card>
                <CardHeader>
                  <CardTitle>Classmates</CardTitle>
                  <CardDescription>
                    Your class has {classmates.length + 1} students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-start p-3 text-sm font-semibold text-gray-900">Name</th>
                          <th className="text-start p-3 text-sm font-semibold text-gray-900">Academic Score</th>
                          <th className="text-start p-3 text-sm font-semibold text-gray-900">Well-being Score</th>
                          <th className="text-start p-3 text-sm font-semibold text-gray-900">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200 bg-blue-50">
                          <td className="p-3 text-sm font-medium">{student.name} (You)</td>
                          <td className="p-3 text-sm">
                            <div className="flex items-center">
                              <span className="font-medium">{student.academicScore}</span>
                              <div className="ml-2 w-24 bg-gray-200 rounded-full h-1.5">
                                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${student.academicScore}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-sm">
                            <div className="flex items-center">
                              <span className="font-medium">{student.wellBeingScore}</span>
                              <div className="ml-2 w-24 bg-gray-200 rounded-full h-1.5">
                                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${student.wellBeingScore}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-sm">
                            <Badge className={
                              Math.abs(student.academicScore - student.wellBeingScore) <= 10
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }>
                              {Math.abs(student.academicScore - student.wellBeingScore) <= 10
                                ? "Good Balance"
                                : "Needs Balance"}
                            </Badge>
                          </td>
                        </tr>
                        {classmates.map((mate, index) => (
                          <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-3 text-sm font-medium">{mate.name}</td>
                            <td className="p-3 text-sm">
                              <div className="flex items-center">
                                <span>{mate.academicScore}</span>
                                <div className="ml-2 w-24 bg-gray-200 rounded-full h-1.5">
                                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${mate.academicScore}%` }}></div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-sm">
                              <div className="flex items-center">
                                <span>{mate.wellBeingScore}</span>
                                <div className="ml-2 w-24 bg-gray-200 rounded-full h-1.5">
                                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${mate.wellBeingScore}%` }}></div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-sm">
                              <Badge className={
                                Math.abs(mate.academicScore - mate.wellBeingScore) <= 10
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }>
                                {Math.abs(mate.academicScore - mate.wellBeingScore) <= 10
                                  ? "Good Balance"
                                  : "Needs Balance"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}