"use client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const axiosInstance = axios.create({
  url: `${process.env.NEXT_PUBLIC_GRAPHQL_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

const isTokenExpired = (token: string) => {
  try {
    const decoded: any = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch {
    return true;
  }
};

const handleLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  window.location.href = "/login";
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      if (isTokenExpired(token)) {
        handleLogout();
        return Promise.reject("Token expired");
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      handleLogout();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
