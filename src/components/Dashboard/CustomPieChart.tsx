"use client";

import { LabelList, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A pie chart with a label list";

const defaultChartConfig = {
  "Bahan Terpakai": {
    label: "Bahan Terpakai",
    color: "#ccc",
  },
  "Bahan Tidak Terpakai": {
    label: "Bahan Tidak Terpakai",
    color: "#eee",
  },
} satisfies ChartConfig;

export const defaultData = [
  {
    type: "Bahan Terpakai",
    data: 10,
    fill: "#504B38",
    tailwindColor: "bg-[#504B38]",
  },
  {
    type: "Bahan Tidak Terpakai",
    data: 50,
    fill: "#EBE5C2",
    tailwindColor: "bg-[#EBE5C2]",
  },
];

export function CustomPieChart({
  chartData = defaultData,
  chartConfig = defaultChartConfig,
  chartTitle = "USAGE",
}: {
  chartData: typeof defaultData;
  chartConfig?: typeof defaultChartConfig;
  chartTitle?: string;
}) {
  return (
    <div className="border-1 p-4 shadow-[2px_2px_5px_rgba(0,0,0,.1)] rounded-md">
      <header>
        <h1 className="font-semibold">{chartTitle}</h1>
      </header>
      <ChartContainer config={chartConfig} className="min-h-[250px]">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="type" />} />
          <Pie dataKey={"data"} nameKey={"type"} data={chartData}>
            <LabelList dataKey={"data"} />
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="space-y-2">
        {chartData.map((data) => (
          <div className="flex items-center gap-2" key={data.type}>
            <div className={`w-5 h-5 ${data.tailwindColor}`}> </div>
            <p>{data.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomPieChart;
