"use client";

import { Area, AreaChart, LabelList, XAxis } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { getWeekUsageStatistic } from "@/lib/api/StatisticAPI";
import { toast } from "react-toastify";

export const description = "A linear area chart";

export const defaultChartData = [
  {
    week: "Week 1",
    data: 50,
  },
  {
    week: "Week 2",
    data: 20,
  },
  {
    week: "Week 3",
    data: 70,
  },
  {
    week: "Week 4",
    data: 30,
  },
];

const defaultChartConfig = {
  "Week 1": {
    label: "Week 1",
  },
  "Week  2": {
    label: "Week 2",
  },
  "Week 3": {
    label: "Week 3",
  },
  "Week 4": {
    label: "Week 4",
  },
} satisfies ChartConfig;

const RenderCustomizedLabel = (props: any) => {
  const { x, y, value, height, width } = props;

  return (
    <g>
      <circle cx={x} cy={y} r={8} fill="#D9D9D9" />
      <text x={x} y={y} dy={-15} textAnchor="middle">
        {value} %
      </text>
    </g>
  );
};

export function EfficiencyLineChart({
  chartData = defaultChartData,
  chartConfig = defaultChartConfig,
}) {
  return (
    <div className=" border-1 shadow-[2px_2px_5px_rgba(0,0,0,.2)] rounded-md p-3 w-full">
      <h1>EFFICIENCY</h1>
      <ChartContainer config={chartConfig}>
        <AreaChart
          data={chartData}
          width={220}
          margin={{
            left: 30,
            right: 30,
            top: 30,
            bottom: 30,
          }}
        >
          <defs>
            <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EBE5C2" />
              <stop offset="100%" stopColor="white" />
            </linearGradient>
          </defs>
          <XAxis dataKey={"week"} />

          <Area
            dataKey={"data"}
            type={"linear"}
            stroke="black"
            fill={"url(#gradientFill)"}
            className="p-10"
          >
            <LabelList
              dataKey={"data"}
              position={"top"}
              className="p-2 font-semibold text-md"
              offset={12}
              content={<RenderCustomizedLabel />}
            />
          </Area>
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

export default EfficiencyLineChart;
