import { createContext, useContext, useState } from "react";

export type StepSleep =
  | "choose-category"
  | "confirm"
  | "sleep"
  | "wake-up"
  | "success"
  | "failed";
export type CategorySleep = "night-sleep" | "day-nap" | "power-nap";
export interface DataSleep {
  category: CategorySleep | "";
  startTime: string;
  endTime: string;
  duration: number;
  earning: number;
}

type SleepProviderState = {
  step: StepSleep;
  setStep: (step: StepSleep) => void;
  data: DataSleep;
  setData: (data: Partial<DataSleep>) => void;
  clearData: () => void
};

const initialState: SleepProviderState = {
  step: "choose-category",
  setStep: () => { },
  data: {
    category: "",
    earning: 0,
    duration: 0,
    endTime: "",
    startTime: "",
  },
  setData: () => { },
  clearData: () => {}
};

export const SLEEP_DATA = {
  "night-sleep": "Night Sleep",
  "day-nap": "Day Nap",
  "power-nap": "Power Nap",
};

const SleepProviderContext = createContext<SleepProviderState>(initialState);

const storageKey = 'data-sleep'

function getDefaultDataSleep() {
  const sleepStorage = localStorage.getItem(storageKey)
  if (sleepStorage) {
    return JSON.parse(sleepStorage)
  }

  return {
    category: "",
    earning: 0,
    duration: 0,
    endTime: "",
    startTime: "",
  }
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

  function updateData(newData: Partial<DataSleep>) {
    setData(prev => {
      const _newData = {
        ...prev,
        ...newData
      }
      localStorage.setItem(storageKey, JSON.stringify(_newData))
      return _newData
    })
  }

  function clearData() {
    setData(() => getDefaultDataSleep())
    localStorage.removeItem(storageKey)
  }

  return (
    <SleepProviderContext.Provider
      value={{
        step,
        setStep,
        data,
        setData: updateData,
        clearData
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
