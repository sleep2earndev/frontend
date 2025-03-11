import { Message } from "@/api/ai";
import { createContext, useContext, useState } from "react";

export type StepSleep =
  | "choose-category"
  | "confirm"
  | "sleep"
  | "wake-up"
  | "success"
  | "failed" | 'chat-ai';
export type CategorySleep = "night-sleep" | "day-nap" | "power-nap";

interface SleepStage {
  count: number;
  minutes: number;
  thirtyDayAvgMinutes?: number; // Opsional karena tidak semua stage memilikinya
}

interface SleepSummary {
  deep: SleepStage;
  light: SleepStage;
  rem: SleepStage;
  wake: SleepStage;
  asleep: SleepStage;
  awake: SleepStage;
  restless: SleepStage;
}

export interface SleepData {
  dateOfSleep: string; // Format: "YYYY-MM-DD"
  duration: number; // Dalam milidetik
  efficiency: number; // Persentase 0-100
  endTime: string; // Format ISO string
  startTime: string; // Format ISO string
  minutesAsleep: number;
  minutesAwake: number;
  timeInBed: number;
  summary: SleepSummary;
}

export interface DataSleep {
  category: CategorySleep | "";
  startTime: string;
  endTime: string;
  targetEndTime: string;
  duration: number;
  earning: number;
  alarmEnabled: boolean;
  sleepData?: SleepData
}

type SleepProviderState = {
  step: StepSleep;
  setStep: (step: StepSleep) => void;
  data: DataSleep;
  setData: (data: Partial<DataSleep>) => void;
  clearData: () => void;

  chatCoach: Message[];
  setChatCoach: React.Dispatch<React.SetStateAction<Message[]>>;
};

const initialState: SleepProviderState = {
  step: "choose-category",
  setStep: () => {},
  data: {
    category: "",
    earning: 0,
    duration: 0,
    endTime: "",
    startTime: "",
    targetEndTime: "",
    alarmEnabled: false
  },
  setData: () => {},
  clearData: () => {},
  chatCoach: [],
  setChatCoach: () => {}
};

export const SLEEP_DATA = {
  "night-sleep": "Night Sleep",
  "day-nap": "Day Nap",
  "power-nap": "Power Nap",
};

const SleepProviderContext = createContext<SleepProviderState>(initialState);

const storageKey = "data-sleep";

function getDefaultDataSleep() {
  const sleepStorage = localStorage.getItem(storageKey);
  if (sleepStorage) {
    try {
      const data = window.atob(sleepStorage);
      return JSON.parse(data);
    } catch {
      return {
        category: "",
        earning: 0,
        duration: 0,
        endTime: "",
        startTime: "",
        targetEndTime: "",
        alarmEnabled: false
      };
    }
  }

  return {
    category: "",
    earning: 0,
    duration: 0,
    endTime: "",
    startTime: "",
    targetEndTime: "",
    alarmEnabled: false
  };
}

export function SleepProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
}) {
  const [step, setStep] = useState<StepSleep>("choose-category");

  const [data, setData] = useState<DataSleep>(() => getDefaultDataSleep());
  const [chatCoach, setChatCoach] = useState<Message[]>([])

  function updateData(newData: Partial<DataSleep>) {
    setData((prev) => {
      const _newData = {
        ...prev,
        ...newData,
      };
      localStorage.setItem(storageKey, window.btoa(JSON.stringify(_newData)));
      return _newData;
    });
  }

  function clearData() {
    setData(() => getDefaultDataSleep());
    localStorage.removeItem(storageKey);
  }

  return (
    <SleepProviderContext.Provider
      value={{
        step,
        setStep,
        data,
        setData: updateData,
        clearData,
        chatCoach,
        setChatCoach
      }}
      {...props}
    >
      {children}
    </SleepProviderContext.Provider>
  );
}

export const useSleep = () => {
  const context = useContext(SleepProviderContext);

  if (context === undefined)
    throw new Error("useSleep must be used within a SleepProvider");

  return context;
};
