"use client";

import { handleError } from "../utils";
import axiosInstance from "./axiosInstance";

export const getUserLogin = async (): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_GRAPHQL_URL}`,
      {
        query: `
            query getUser{
          getUserLogin{
            id
            name
            email
            phone_number
            company_name
          }
        }
  `,
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
      message: "User retrieved",
      data: data.getUserLogin,
    };
  } catch (err: any) {
    return handleError(err);
  }
};
