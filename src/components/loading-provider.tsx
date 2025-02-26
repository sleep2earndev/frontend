import { createContext, useContext, useState } from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

type LoadingProviderProps = {
  children: React.ReactNode;
};

type LoadingProviderState = {
  loading: boolean;
  setLoading: (status: boolean) => void;
};

const initialState: LoadingProviderState = {
  loading: false,
  setLoading: () => null,
};

const LoadingProviderContext =
  createContext<LoadingProviderState>(initialState);

export function LoadingProvider({ children, ...props }: LoadingProviderProps) {
  const [loading, setLoading] = useState(false);

  const value = {
    loading,
    setLoading,
  };

  return (
    <LoadingProviderContext.Provider {...props} value={value}>
      {children}
    </LoadingProviderContext.Provider>
  );
}

export const useLoading = () => {
  const context = useContext(LoadingProviderContext);

  if (context === undefined)
    throw new Error("useLoading must be used within a LoadingProvider");

  return context;
};

export const Loading = () => {
  const { loading } = useLoading();
  if (!loading) return;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 100 }}
      className="fixed inset-0 z-[99999] bg-background/85 flex flex-col gap-2 justify-center items-center"
    >
      <Loader2 className="animate-spin w-10 h-10" />
      <p className="text-center">Please wait...</p>
    </motion.div>
  );
};
