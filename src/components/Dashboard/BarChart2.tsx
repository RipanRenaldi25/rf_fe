"use client";

import { Bar, BarChart, LabelList } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { makeCapitalizeText } from "@/lib/utils";

export const description = "A bar chart with a label";

const defaultChartData = [
  {
    type: "Reuse",
    data: 100,
    fill: "#B9B28A",
    tailwindColor: `bg-[#B9B28A]`,
  },
  {
    type: "Reutilization",
    data: 150,
    fill: "#EBE5C2",
    tailwindColor: `bg-[#EBE5C2]`,
  },
  {
    type: "Waste",
    data: 50,
    fill: "#504B38",
    tailwindColor: `bg-[#504B38]`,
  },
];

const defaultChartConfig = {
  Reuse: {
    label: "Reuse",
    color: "#B9B28A",
  },
  Reutilization: {
    label: "Reutilization",
    color: "#EBE5C2",
  },
  Waste: {
    label: "Waste",
    color: "#504B38",
  },
} satisfies ChartConfig;

export default function CustomBarChart({
  chartData = defaultChartData,
  chartConfig = defaultChartConfig,
  chartTitle = "RECAP",
}) {
  return (
    <div className="p-4 border-1 rounded-md shadow-[2px_2px_3px_rgba(0,0,0,0.2)]">
      <header>
        <h1 className="font-semibold">{chartTitle}</h1>
      </header>
      <ChartContainer
        config={chartConfig}
        className="p-3  min-h-[250px] font-bold  "
      >
        <BarChart data={chartData} width={514} height={250} accessibilityLayer>
          <ChartTooltip content={<ChartTooltipContent nameKey="type" />} />
          <Bar dataKey={"data"} radius={4}>
            <LabelList
              dataKey={"data"}
              position={"top"}
              className="font-bold"
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      <div className="p-4">
        <div className="flex justify-around items-center  border-t-1 border-black py-2">
          {chartData.map((data: any, i) => (
            <div className="flex gap-3 shape items-center" key={i}>
              {/* <div className={`w-4 h-4  rounded-[3px] bg-[${data.fill}]`}></div> */}
              <div
                className={`w-4 h-4  rounded-[3px] ${data.tailwindColor}`}
              ></div>
              <p>{makeCapitalizeText(data.type)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
