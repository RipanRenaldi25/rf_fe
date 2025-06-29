import { clsx, type ClassValue } from "clsx";
import { Inter, Lusitana } from "next/font/google";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const lusitana = Lusitana({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const inter = Inter({ subsets: ["latin"] });

export const handleError = (err: any) => {
  console.log({ err });
  return {
    success: false,
    message: err.response?.data?.errors[0]?.message ?? err.message,
  };
};

export const makeCapitalizeText = (text: string) => {
  const data = text.toLowerCase().split("");
  data[0] = data[0].toUpperCase();

  return data.join("");
};

export const getDate = (date: Date) => {
  const dateFormat = Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return dateFormat.format(date);
};

export const getHour = (date: Date) => {
  const dateFormat = Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return dateFormat.format(date);
};

export const changeComaToDot = (numberInStringWithComa: string) => {
  // if (numberInStringWithComa.includes(".")) {
  //   return numberInStringWithComa;
  // }
  const number = +numberInStringWithComa.split(",").join(".");
  return number;
};

export const getInitialUsername = (name: string) => {
  const splitedName = name.split(" ");
  let initialName = "";
  splitedName.forEach((name) => {
    initialName += name[0];
  });

  return initialName;
};
