import { createContext, Dispatch, SetStateAction, useState } from "react";

interface ILoading {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

interface ILoadingContext {}

const LoadingContext = createContext<ILoadingContext>({});

export const LoadingProvider = () => {
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
};
