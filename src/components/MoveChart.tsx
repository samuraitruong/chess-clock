"use client";

import { useEffect, useState } from "react";

export interface MoveChartProps {
  data: number[];
  color?: string;
}

export function MoveChart(props: MoveChartProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || props.data.length === 0) {
    return null;
  }

  const maxTime = Math.max(...props.data);
  const minTime = Math.min(...props.data);
  const range = maxTime - minTime || 1;

  return (
    <div className="h-24 w-full flex items-end justify-center space-x-1 px-4">
      {props.data.map((time, index) => {
        const height = Math.max(4, ((time - minTime) / range) * 80);
        return (
          <div
            key={index}
            className="bg-blue-500 opacity-70 min-w-[2px] rounded-t"
            style={{
              height: `${height}px`,
              backgroundColor: props.color || "rgba(59, 130, 246, 0.7)",
            }}
            title={`Move ${index + 1}: ${(time / 1000).toFixed(1)}s`}
          />
        );
      })}
    </div>
  );
}
