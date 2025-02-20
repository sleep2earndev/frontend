import { createContext, useContext, useState } from "react";

export type StepSleep = 'choose-category' | 'confirm' | 'sleep' | 'wake-up' | 'success' | 'failed'
export type CategorySleep = 'night-sleep' | 'day-nap' | 'power-nap'
export interface DataSleep {
    category: CategorySleep | '';
    startTime: string;
    endTime: string;
    duration: number;
    earning: number
}

type SleepProviderState = {
    step: StepSleep;
    setStep: (step: StepSleep) => void;
    data: DataSleep;
    setData: (data: DataSleep) => void;
};

const initialState: SleepProviderState = {
    step: 'choose-category',
    setStep: () => { },
    data: {
        category: '',
        earning: 0,
        duration: 0,
        endTime: '',
        startTime: ''
    },
    setData: () => { }
}

const SleepProviderContext = createContext<SleepProviderState>(initialState);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SleepProvider({ children, ...props }: { children: React.ReactNode, [k: string]: any }) {
    const [step, setStep] = useState<StepSleep>('choose-category')
    const [data, setData] = useState<DataSleep>({
        category: '',
        earning: 0,
        duration: 0,
        endTime: '',
        startTime: ''
    })
    return (
        <SleepProviderContext.Provider value={{
            step,
            setStep,
            data,
            setData
        }} {...props}>
            {children}
        </SleepProviderContext.Provider>
    )
}

export const useSleep = () => {
    const context = useContext(SleepProviderContext);

    if (context === undefined)
        throw new Error("useSleep must be used within a SleepProvider");

    return context;
};
