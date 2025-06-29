"use server";
import axios from "axios";
import { handleError } from "../utils";

export const login = async (
  payload: ILoginPayload
): Promise<{
  success: boolean;
  message: string;
  data?: ILoginResponse | undefined;
}> => {
  try {
    const response = await axios.post(`${process.env.GRAPHQL_URL}`, {
      query: `
      mutation Login($payload: LoginPayload) {
          login(payload: $payload) {
          accessToken
          refreshToken
        }
      }
    `,
      variables: {
        payload: {
          ...payload,
        },
      },
    });
    const data = response.data.data.login;
    return { success: true, message: "Login success", data };
  } catch (err: any) {
    return handleError(err);
  }
};

export const register = async (
  payload: Omit<IUser, "created_at" | "updated_at">
): Promise<{
  data?: IUser | undefined;
  success: boolean;
  message: string;
}> => {
  try {
    const response = await axios.post(`${process.env.GRAPHQL_URL}`, {
      query: `
        mutation register($payload: RegisterPayload){
          register(payload: $payload){
            name
            company_name
            email
            id
            password
            phone_number
            created_at
            updated_at
          }
        }
      `,
      variables: {
        payload: {
          ...payload,
        },
      },
    });
    const { data } = response.data;

    return {
      success: true,
      message: "Register success",
      data: {
        ...data.register,
      },
    };
  } catch (err: any) {
    return handleError(err);
  }
};
