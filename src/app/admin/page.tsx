'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

interface AdminDashboardData {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  studentDistribution: { className: string; count: number }[];
  genderDistribution: { gender: string; count: number }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);

  useEffect(() => {
    fetch('/api/admin')
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500">Total Students</p>
            <p className="text-2xl font-semibold">{data.totalStudents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500">Total Teachers</p>
            <p className="text-2xl font-semibold">{data.totalTeachers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500">Total Classes</p>
            <p className="text-2xl font-semibold">{data.totalClasses}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">Students Per Class</h2>
            <Bar
              data={{
                labels: data.studentDistribution.map((d) => d.className),
                datasets: [
                  {
                    label: 'Students',
                    data: data.studentDistribution.map((d) => d.count),
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    borderRadius: 8,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
