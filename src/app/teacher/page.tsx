'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Bar, Pie, Line } from 'react-chartjs-2'
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js'
import { useAuth } from '@/context/auth-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Users,
  GraduationCap,
  Heart,
  Activity,
  AlertTriangle,
  Clock,
  ChevronRight,
  RefreshCw
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
)

type DashboardData = {
  name: string
  totalStudents: number
  averageAcademicScore: number
  averageWellBeingScore: number
  wellBeingDistribution: { scoreRange: string; count: number }[]
  socialGraph: { label: string; count: number }[]
  recentStudents: { name: string; academicScore: number; status: string }[]
}

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      if (user?.id) {
        const res = await fetch(`/api/teacher?userId=${user.id}`)
        const json = await res.json()
        setData(json)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Unable to load dashboard</h2>
        <p className="text-muted-foreground mb-4">We couldn't retrieve your classroom data.</p>
        <Button onClick={fetchData}>Try Again</Button>
      </div>
    )
  }

  // Academic score visualization helper
  const getScoreColor = (score: any) => {
    if (score >= 85) return "text-green-600"
    if (score >= 70) return "text-blue-600"
    if (score >= 50) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {data.name}</h1>
          <p className="text-muted-foreground mt-1">
            Here's your classroom insights for today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
          <Button size="sm" variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-1/2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="wellbeing">Well-being</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Students</CardDescription>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-3xl">{data.totalStudents}</CardTitle>
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-xs text-muted-foreground">
                  Enrolled in your classroom
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Academic Performance</CardDescription>
                <div className="flex justify-between items-center">
                  <CardTitle className={`text-3xl ${getScoreColor(data.averageAcademicScore)}`}>
                    {data.averageAcademicScore.toFixed(1)}
                  </CardTitle>
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-xs text-muted-foreground">
                  Average class score (out of 100)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Well-being Index</CardDescription>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-3xl">
                    {data.averageWellBeingScore.toFixed(1)}
                  </CardTitle>
                  <Heart className="h-6 w-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-xs text-muted-foreground">
                  Average well-being score (out of 10)
                </div>
                <div className="mt-2">
                  <Progress value={data.averageWellBeingScore * 10} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Social Engagement</CardDescription>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-3xl">
                    {Math.round((data.socialGraph.find(s => s.label === "Engaged")?.count || 0) / data.totalStudents * 100)}%
                  </CardTitle>
                  <Activity className="h-6 w-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-xs text-muted-foreground">
                  Students socially engaged
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="md:col-span-1 h-80">
              <CardHeader>
                <CardTitle>Well-Being Distribution</CardTitle>
                <CardDescription>Student count by well-being score range</CardDescription>
              </CardHeader>
              <CardContent>
                <Bar
                  data={{
                    labels: data.wellBeingDistribution.map((w) => w.scoreRange),
                    datasets: [
                      {
                        label: 'Students',
                        data: data.wellBeingDistribution.map((w) => w.count),
                        backgroundColor: [
                          'rgba(239, 68, 68, 0.7)',
                          'rgba(245, 158, 11, 0.7)',
                          'rgba(59, 130, 246, 0.7)',
                          'rgba(16, 185, 129, 0.7)',
                        ],
                        borderColor: [
                          'rgb(239, 68, 68)',
                          'rgb(245, 158, 11)',
                          'rgb(59, 130, 246)',
                          'rgb(16, 185, 129)',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          title: (items) => `Score Range: ${items[0].label}`,
                          label: (context) => `Number of Students: ${context.raw}`
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0
                        }
                      }
                    }
                  }}
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-1 h-80">
              <CardHeader>
                <CardTitle>Social Interaction</CardTitle>
                <CardDescription>Student engagement profile</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-52">
                <Pie
                  data={{
                    labels: data.socialGraph.map((s) => s.label),
                    datasets: [
                      {
                        data: data.socialGraph.map((s) => s.count),
                        backgroundColor: [
                          'rgba(16, 185, 129, 0.7)',  // Engaged
                          'rgba(239, 68, 68, 0.7)',   // Isolated
                        ],
                        borderColor: [
                          'rgb(16, 185, 129)',
                          'rgb(239, 68, 68)',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => `${context.label}: ${context.raw} students (${Math.round((context.raw as number / data.totalStudents) * 100)}%)`
                        }
                      }
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Recently Active Students */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recently Active Students</CardTitle>
                  <CardDescription>Student activity in the last 24 hours</CardDescription>
                </div>
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentStudents.map((student, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">Academic Score: {student.academicScore}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={student.status === 'Active'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                        }
                      >
                        {student.status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-4">
          <Card className="h-96">
            <CardHeader>
              <CardTitle>Academic Performance Trends</CardTitle>
              <CardDescription>Average class scores over the last semester</CardDescription>
            </CardHeader>
            <CardContent>
              <Line
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                  datasets: [
                    {
                      label: 'Class Average',
                      data: [68, 72, 75, 72, data.averageAcademicScore],
                      borderColor: 'rgb(59, 130, 246)',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      fill: true,
                      tension: 0.3,
                    }
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      min: 50,
                      max: 100,
                      title: {
                        display: true,
                        text: 'Score'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Month'
                      }
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wellbeing" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Well-being Indicators</CardTitle>
                <CardDescription>Key factors affecting student well-being</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Emotional State</span>
                      <span className="text-sm font-medium">7.2/10</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Social Connection</span>
                      <span className="text-sm font-medium">6.8/10</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Stress Management</span>
                      <span className="text-sm font-medium">5.9/10</span>
                    </div>
                    <Progress value={59} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Classroom Environment</span>
                      <span className="text-sm font-medium">8.1/10</span>
                    </div>
                    <Progress value={81} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}