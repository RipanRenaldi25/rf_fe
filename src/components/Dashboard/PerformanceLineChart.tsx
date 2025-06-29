"use client";
import { useEffect, useState } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Area, AreaChart, Tooltip, XAxis } from "recharts";
import { getPerformanceSummary } from "@/lib/api/StatisticAPI";
import { toast } from "react-toastify";
import { defaultData } from "./CustomPieChart";

const defaultChartData = [
  {
    week: "Week 1",
    input: 50,
    output: 30,
  },
  {
    week: "Week 2",
    input: 20,
    output: 60,
  },
  {
    week: "Week 3",
    input: 70,
    output: 50,
  },
  {
    week: "Week 4",
    input: 30,
    output: 80,
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

export const PerformanceLineChart = ({
  chartData = defaultChartData,
  chartConfig = defaultChartConfig,
  chartTitle = "PERFORMANCE",
}) => {
  return (
    <div className="p-3 border-1 shadow-[2px_2px_5px_rgba(0,0,0,.1)] rounded-md">
      <h1 className="font-semibold">{chartTitle}</h1>
      <ChartContainer config={chartConfig}>
        <AreaChart
          data={chartData}
          margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
        >
          <defs>
            <linearGradient id="colorData1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#99BC85" stopOpacity={0.8} />
              <stop offset="95%" stopColor="white" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorData2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#BF3131" stopOpacity={0.8} />
              <stop offset="95%" stopColor="white" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey={"week"} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            dataKey={"input"}
            fill="url(#colorData1)"
            stroke="#99BC85"
            type={"natural"}
          />
          <Area
            dataKey={"output"}
            fill="url(#colorData2)"
            stroke="#BF3131"
            type={"natural"}
          />
        </AreaChart>
      </ChartContainer>
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center  gap-2">
          <div className="size-4 bg-[#99BC85] rounded-sm"></div>
          <span>Input</span>
        </div>
        <div className="flex items-center  gap-2">
          <div className="size-4 bg-[#BF3131]  rounded-sm"></div>
          <span>Output</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceLineChart;
