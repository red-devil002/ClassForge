"use client"
import { useState } from 'react';

// Type definition for Student
type Student = {
  id: string;
  name: string;
  friends: string;  // Contains names of friends, not IDs
  disrespectfull: string;  // Contains names of disrespected students, not IDs
};

// Simpler student node component for visualization
const StudentNode = ({ x, y, radius, id, isHovered, onMouseOver, onMouseOut }: any) => {
  return (
    <circle
      cx={x}
      cy={y}
      r={radius}
      fill="#6495ED"
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      style={{ cursor: 'pointer' }}
    />
  );
};

// Connection line between students
const ConnectionLine = ({ x1, y1, x2, y2, type }: any) => {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={type === 'friend' ? '#0066cc' : '#cc0000'}
      strokeWidth={2}
    />
  );
};

export default function ClassGraph({ students }: { students: Student[] }) {
  const [hoveredStudent, setHoveredStudent] = useState<string | null>(null);

  // Process students into a more usable format
  const nodesAndLinks = processStudentData(students);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-lg font-bold mb-4">Student Relationship Graph</div>
      <div className="relative w-full bg-gray-100 rounded-lg shadow-md p-4">
        <svg
          viewBox="0 0 600 400"
          width="100%"
          height="400"
          className="w-full"
        >
          {/* Legend */}
          <g transform="translate(460, 20)">
            <line x1={0} y1={0} x2={20} y2={0} stroke="#0066cc" strokeWidth={2} />
            <text x={25} y={5} fontSize={12}>Friend</text>
            <line x1={0} y1={20} x2={20} y2={20} stroke="#cc0000" strokeWidth={2} />
            <text x={25} y={25} fontSize={12}>Disrespectful</text>
          </g>

          {/* Connection lines */}
          {nodesAndLinks.links.map((link: any, index: number) => (
            <ConnectionLine
              key={`link-${index}`}
              x1={link.source.x}
              y1={link.source.y}
              x2={link.target.x}
              y2={link.target.y}
              type={link.type}
            />
          ))}

          {/* Student nodes */}
          {nodesAndLinks.nodes.map((node, index) => (
            <g key={`node-${node.id}`}>
              <StudentNode
                x={node.x}
                y={node.y}
                radius={15}
                id={node.id}
                isHovered={hoveredStudent === node.name}
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
                {index + 1}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover info */}
        {hoveredStudent && (
          <div className="absolute top-2 left-2 bg-white p-2 rounded-md shadow-md">
            <span className="font-semibold">{hoveredStudent}</span>
          </div>
        )}
      </div>
      <div className="mt-4 text-gray-600 text-sm">
        <p>Blue lines represent friendships, red lines represent disrespectful relationships.</p>
        <p>Hover over a node to see the student's name.</p>
      </div>
    </div>
  );
}

// Function to process student data into nodes and links with fixed positions
function processStudentData(students: Student[]) {
  // Create a map for quick lookup by name
  const studentMap = new Map();
  students.forEach(student => {
    studentMap.set(student.name, student);
  });

  // Pre-calculate node positions in a circular layout
  const nodes = students.map((student, index) => {
    const angle = (index / students.length) * Math.PI * 2;
    const radius = 150;
    const centerX = 300;
    const centerY = 200;

    return {
      ...student,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  // Process links
  const links = [] as any;

  // Add friendship links
  nodes.forEach(source => {
    const friendNames = (source.friends || "").split(',').map(name => name.trim()).filter(Boolean);
    friendNames.forEach(friendName => {
      const target = nodes.find(node => node.name === friendName.trim());
      if (target) {
        links.push({
          source,
          target,
          type: 'friend'
        });
      }
    });
  });

  // Add disrespectful links
  nodes.forEach(source => {
    const disrespectfulNames = (source.disrespectfull || "").split(',').map(name => name.trim()).filter(Boolean);
    disrespectfulNames.forEach(disrespectfulName => {
      const target = nodes.find(node => node.name === disrespectfulName.trim());
      if (target) {
        links.push({
          source,
          target,
          type: 'disrespectful'
        });
      }
    });
  });

  return { nodes, links };
}