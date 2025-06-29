"use client";
import axiosInstance from "./axiosInstance";
import { handleError } from "../utils";

const fetchStatisticData = async (
  query: string,
  functionName: string
): Promise<{ message: string; success: boolean; data?: any }> => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_GRAPHQL_URL}`,
      {
        query: query,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    const { data } = response.data;

    return {
      success: true,
      message: "Recap summary fetched",
      data: data[functionName],
    };
  } catch (err: any) {
    return handleError(err);
  }
};

export const getRecapSummary = async () => {
  return await fetchStatisticData(
    `
            query getMaterialCategorySummary{
                getMaterialCategorySummary {
                    total
                    type
                }
            }
        `,
    "getMaterialCategorySummary"
  );
};

export const getUsageStatistic = async () => {
  return await fetchStatisticData(
    `
            query getUsageStatistic {
                getUsageStatistic {
                  used_percentage
                  unused_percentage
                }
              }
        `,
    "getUsageStatistic"
  );
};

export const getWeekUsageStatistic = async () => {
  return await fetchStatisticData(
    `
            query getWeekUsageStatistic {
              getWeekUsageStatistic {
                week
                used_percentage
                unused_percentage
              }
            }
        `,
    "getWeekUsageStatistic"
  );
};

export const getPerformanceSummary = async () => {
  return await fetchStatisticData(
    `
           query getPerformanceSummary {
            getPerformanceSummary {
              week
              input
              output
            }
          }
        `,
    "getPerformanceSummary"
  );
};
export const getLastWeekCategorySummary = async () => {
  return await fetchStatisticData(
    `
        query getLastWeekCategorySummary{
          getLastWeekMaterialSummary {
            total
            type
          }
        }
        `,
    "getLastWeekMaterialSummary"
  );
};
