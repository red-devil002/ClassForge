// import React from "react";
// import { PieChart, Pie, Cell } from "recharts";

// type Props = {
//     label: string;
//     value: number;
//     total: number;
//     color?: string;
//     percentage?: number;
// };

// export default function SemicircleChart({ label, value, total, color = "#3b82f6", percentage }: Props) {
//     const chartData = [
//         { name: label, value },
//         { name: "Remaining", value: Math.max(0, total - value) }
//     ];

//     const COLORS = [color, "#e5e7eb"];

//     return (
//         <div className="text-center">
//             <PieChart width={120} height={70}>
//                 <Pie
//                     data={chartData}
//                     startAngle={180}
//                     endAngle={0}
//                     innerRadius={20}
//                     outerRadius={35}
//                     paddingAngle={2}
//                     dataKey="value"
//                 >
//                     {chartData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index]} />
//                     ))}
//                 </Pie>
//             </PieChart>
//             <p className="text-sm">{label}: {percentage}%</p>
//         </div>
//     );
// }

"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type Props = {
    label: string;
    value: number;
    total: number;
    color?: string;
    percentage?: string;
};

export default function SemicircleChart({
    label,
    value,
    total,
    color = "#3b82f6",
    percentage,
}: Props) {
    const chartData = [
        { name: label, value },
        { name: "Remaining", value: Math.max(0, total - value) },
    ];

    const COLORS = [color, "#e5e7eb"];
    const pct = percentage ?? Math.round((value / total) * 100);

    return (
        <div className="flex flex-col items-center w-full h-full">
            <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                    <Pie
                        data={chartData}
                        startAngle={180}
                        endAngle={0}
                        innerRadius="60%"
                        outerRadius="100%"
                        paddingAngle={3}
                        dataKey="value"
                        labelLine={false}
                        label={({ cx, cy }) => (
                            <text
                                x={cx}
                                y={cy - 20}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={18}
                                fontWeight={600}
                                fill="#111827"
                            >
                                {pct}%
                            </text>
                        )}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <h3 className="text-sm mt-2 font-serif font-bold text-gray-700">{label}</h3>
        </div>
    );
}
