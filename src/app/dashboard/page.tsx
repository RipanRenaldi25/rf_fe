"use client";
export const dynamic = "force-dynamic";
import CustomBarChart from "@/components/Dashboard/BarChart2";
import CustomPieChart, {
  defaultData,
} from "@/components/Dashboard/CustomPieChart";
import EfficiencyLineChart, {
  defaultChartData,
} from "@/components/Dashboard/EfficiencyLineChart";
import { PerformanceLineChart } from "@/components/Dashboard/PerformanceLineChart";
import { InventoryContext } from "@/context/InventoryContext";
import {
  getPerformanceSummary,
  getRecapSummary,
  getUsageStatistic,
  getWeekUsageStatistic,
} from "@/lib/api/StatisticAPI";
import { useContext } from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function DashboardPage() {
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState<any>([]);
  const [lineChartData, setLineChartData] = useState<any>([]);
  const [performanceData, setPerformanceData] = useState<any>([]);
  const { inventoryData } = useContext(InventoryContext);

  useEffect(() => {
    async function recapSummary() {
      const data = await getRecapSummary();
      if (!data.success) {
        toast.error(data.message);
        return;
      }

      setBarChartData(
        data.data.map((val: any) => {
          let fill = "";
          let tailwindColor = "";
          switch (val.type) {
            case "REUSE":
              fill = "#B9B28A";
              tailwindColor = "bg-[#B9B28A]";
              break;
            case "REUTILIZATION":
              fill = "#EBE5C2";
              tailwindColor = "bg-[#EBE5C2]";
              break;
            case "WASTE":
              fill = "#504B38";
              tailwindColor = "bg-[#504B38]";
              break;
          }
          return {
            type: val.type,
            data: val.total,
            fill,
            tailwindColor,
          };
        })
      );
    }

    async function recapUsage() {
      const { message, success, data } = await getUsageStatistic();
      if (!success) {
        toast.error(message);
        return;
      }
      const pieCharts = Object.entries(data);
      if (data) {
        setPieChartData(
          pieCharts.map(([key, value]: any) => {
            let fill = "";
            let tailwindColor = "";
            let type = "";
            switch (key) {
              case "used_percentage":
                fill = "#504B38";
                tailwindColor = "bg-[#504B38]";
                type = "Bahan Terpakai";
                break;
              case "unused_percentage":
                fill = "#EBE5C2";
                tailwindColor = "bg-[#EBE5C2]";
                type = "Bahan Tidak Terpakai";
                break;
            }
            return {
              data: value,
              type,
              fill,
              tailwindColor,
            };
          })
        );

        const dataToInsert = pieCharts.reduce(
          (acc: number, [key, value]: any) => acc + value,
          0
        );

        const wasteData = 100 - dataToInsert;

        const dataForChart = [];

        setPieChartData((prevValue: any) =>
          [
            ...prevValue,
            {
              fill: "#B9B28A",
              tailwindColor: "bg-[#B9B28A]",
              data: +wasteData.toFixed(2),
              type: "Bahan Terbuang",
            },
          ].filter((val) => val.data > 0)
        );
      }
    }

    async function fetchEfficiencyData() {
      const { message, success, data } = await getWeekUsageStatistic();
      if (!success) {
        toast.error(message);
        return;
      }
      setLineChartData(
        data.map((val: any) => {
          return {
            week: `Week ${val.week}`,
            data: val.used_percentage,
          };
        })
      );
    }

    async function fetchPerformanceData() {
      const { message, success, data } = await getPerformanceSummary();
      if (!success) {
        toast.error(message);
        return;
      }
      setPerformanceData(
        data.map((val: { week: number; input: number; output: number }) => {
          return {
            week: `Week ${val.week}`,
            input: val.input,
            output: val.output,
          };
        })
      );
    }

    Promise.all([
      recapUsage(),
      recapSummary(),
      fetchEfficiencyData(),
      fetchPerformanceData(),
    ]);
  }, [inventoryData]);

  return (
    <article className="w-full">
      <section className="flex gap-3 p-3 ">
        <CustomBarChart chartData={barChartData} />
        <CustomPieChart chartData={pieChartData} />
      </section>
      <section className="p-3 space-y-3">
        <EfficiencyLineChart chartData={lineChartData} />
        <PerformanceLineChart chartData={performanceData} />
      </section>
    </article>
  );
}
