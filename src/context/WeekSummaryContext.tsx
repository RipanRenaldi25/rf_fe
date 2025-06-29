import { getLastWeekCategorySummary } from "@/lib/api/StatisticAPI";
import { createContext, useState, ReactNode, useEffect } from "react";
import { toast } from "react-toastify";

interface ISummary {
  // isi struktur ISummary kamu di sini
}

interface IWeekSummaryContext {
  summary: ISummary[];
  setSummary: any;
}

export const WeekSummaryContext = createContext<IWeekSummaryContext>({
  summary: [],
  setSummary: () => {},
});

interface Props {
  children: ReactNode;
}

export const WeekSummaryProvider = ({ children }: Props) => {
  const [summary, setSummary] = useState<ISummary[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { message, success, data } = await getLastWeekCategorySummary();
      if (!success) {
        toast.error(message);
        return;
      }
      setSummary(data);
    }

    fetchData();
  }, []);

  return (
    <WeekSummaryContext.Provider value={{ summary, setSummary }}>
      {children}
    </WeekSummaryContext.Provider>
  );
};
