import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProfile, type ProfileData } from "@/api/user";
import { useLocation, Navigate } from "react-router";

type ProfileProviderProps = {
  children: React.ReactNode;
};

type ProfileProviderState = {
  profile: ProfileData | null;
  setProfile: (profile: ProfileData) => void;
};

const initialState: ProfileProviderState = {
  profile: null,
  setProfile: () => null,
};

const ProfileProviderContext =
  createContext<ProfileProviderState>(initialState);

export function ProfileProvider({ children, ...props }: ProfileProviderProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const value = useMemo<ProfileProviderState>(() => {
    return {
      profile,
      setProfile,
    };
  }, [profile]);

  return (
    <ProfileProviderContext.Provider {...props} value={value}>
      {children}
    </ProfileProviderContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileProviderContext);

  if (context === undefined)
    throw new Error("useProfile must be used within a ProfileProvider");

  return context;
};

export const ProfileWrapper = ({ children }: { children: React.ReactNode }) => {
  const { setProfile } = useProfile();
  const location = useLocation();

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
    enabled: location.pathname.startsWith("/play"),
  });

  useEffect(() => {
    if (isSuccess) {
      setProfile(data);
    }
  }, [data, isSuccess]);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  // if (location.pathname.startsWith("/play") && isError) {
  //   return <Navigate to={"/"} replace />;
  // }

  return <>{children}</>;
};
