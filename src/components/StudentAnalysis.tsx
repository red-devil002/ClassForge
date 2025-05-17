"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import toast from "react-hot-toast";

// -----------------------------
// Types
// -----------------------------
type Student = {
  id: string;
  userId: string;
  name: string;
  friends: string;
  disrespectfull: string;
};

type Class = {
  id: string;
  name: string;
  students: Student[];
};

// -----------------------------
// Individual SVG Node Component
// -----------------------------
const StudentNode = ({
  x, y, radius, isHovered, isSelected, onMouseOver, onMouseOut
}: any) => (
  <circle
    cx={x}
    cy={y}
    r={radius}
    fill={isSelected ? "#3b82f6" : "#6495ED"}
    stroke={isHovered || isSelected ? "#1e40af" : "transparent"}
    strokeWidth={2}
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
    style={{ cursor: 'pointer', transition: 'fill 0.2s, stroke 0.2s' }}
  />
);

// -----------------------------
// Connection Line Between Nodes
// -----------------------------
const ConnectionLine = ({ x1, y1, x2, y2, type, isHighlighted }: any) => (
  <line
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    stroke={type === 'friend' ? '#3b82f6' : '#ef4444'}
    strokeWidth={isHighlighted ? 3 : 1.5}
    strokeOpacity={isHighlighted ? 1 : 0.6}
    style={{ transition: 'stroke-width 0.2s, stroke-opacity 0.2s' }}
  />
);

// -----------------------------
// Semicircle Chart
// -----------------------------
const SemicircleChart = ({ label, value, total, color = "#3b82f6" }:any) => {
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
  const [hoveredStudent, setHoveredStudent] = useState<string | null>(null);
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
  const { nodes, links } = processGraph(studentClass.students);

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
      <div className="bg-white p-4 rounded-xl shadow-md relative">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Class Relationship Graph</h4>
        <svg viewBox="0 0 600 400" className="w-full h-[300px]">
          {/* Legend */}
          <g transform="translate(460, 20)">
            <line x1={0} y1={0} x2={20} y2={0} stroke="#3b82f6" strokeWidth={2} />
            <text x={25} y={5} fontSize={12} fill="#4b5563">Friend</text>
            <line x1={0} y1={20} x2={20} y2={20} stroke="#ef4444" strokeWidth={2} />
            <text x={25} y={25} fontSize={12} fill="#4b5563">Disrespectful</text>
          </g>

          {/* Graph links */}
          {links.map((link, i) => (
            <ConnectionLine
              key={i}
              x1={link.source.x}
              y1={link.source.y}
              x2={link.target.x}
              y2={link.target.y}
              type={link.type}
              isHighlighted={
                link.source.id === selectedStudent.id ||
                link.target.id === selectedStudent.id
              }
            />
          ))}

          {/* Graph nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              <StudentNode
                x={node.x}
                y={node.y}
                radius={15}
                isHovered={hoveredStudent === node.name}
                isSelected={node.id === selectedStudent.id}
                onMouseOver={() => setHoveredStudent(node.name)}
                onMouseOut={() => setHoveredStudent(null)}
              />
              <text
                x={node.x}
                y={node.y}
                fontSize={10}
                fill="white"
                textAnchor="middle"
                dy={4}
              >
                {node.name.slice(0, 2)}
              </text>
            </g>
          ))}
        </svg>

        {/* Hovered name display */}
        {hoveredStudent && (
          <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded shadow text-sm font-medium text-gray-800 border border-gray-200">
            {hoveredStudent}
          </div>
        )}
      </div>
    </div>
  );
}

// -----------------------------
// Graph Layout Generator
// -----------------------------
function processGraph(students: Student[]) {
  const nodes = students.map((student, i) => {
    const angle = (i / students.length) * Math.PI * 2;
    const r = 140, cx = 300, cy = 200;
    return {
      ...student,
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });

  const links: any[] = [];

  nodes.forEach(source => {
    const friends = (source.friends || "").split(",").map(n => n.trim()).filter(Boolean);
    const enemies = (source.disrespectfull || "").split(",").map(n => n.trim()).filter(Boolean);

    friends.forEach(name => {
      const target = nodes.find(n => n.name.trim().toLowerCase() === name.toLowerCase());
      if (target && target.id !== source.id) {
        links.push({ source, target, type: "friend" });
      }
    });

    enemies.forEach(name => {
      const target = nodes.find(n => n.name.trim().toLowerCase() === name.toLowerCase());
      if (target && target.id !== source.id) {
        links.push({ source, target, type: "disrespectful" });
      }
    });

  });

  return { nodes, links };
}
