"use client";

import React, { useMemo, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
const ForceGraph2D = dynamic(() => import("react-force-graph").then(mod => mod.ForceGraph2D), { ssr: false });

type Student = {
  id: string;
  name: string;
  friends: string;
  disrespectful: string;
};

type Props = {
  students: Student[];
};

export default function ClassGraph({ students }: Props) {
  const graphRef = useRef<any>();

  const graphData = useMemo(() => {
    const nodes = students.map((s) => ({
      id: s.id,
      name: s.name,
    }));

    const edges: { source: string; target: string; type: string }[] = [];

    for (const student of students) {
      const fromId = student.id;

      if (student.friends) {
        for (const name of student.friends.split(",").map(n => n.trim())) {
          const target = students.find((s) => s.name === name);
          if (target) {
            edges.push({ source: fromId, target: target.id, type: "friend" });
          }
        }
      }

      if (student.disrespectful) {
        for (const name of student.disrespectful.split(",").map(n => n.trim())) {
          const target = students.find((s) => s.name === name);
          if (target) {
            edges.push({ source: fromId, target: target.id, type: "disrespect" });
          }
        }
      }
    }

    return {
      nodes,
      links: edges
    };
  }, [students]);

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force("link")?.distance((link: any) =>
        link.type === "disrespect" ? 200 : 50
      );
    }
  }, [graphData]);

  return (
    <div className="w-full h-[600px] border rounded shadow bg-white">
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeLabel="name"
        nodeAutoColorBy="id"
        linkColor={(link: any) => (link.type === "disrespect" ? "red" : "blue")}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={1.5}
        linkDirectionalArrowLength={3.5}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(label, node.x, node.y + 10);
        }}
      />
    </div>
  );
}
