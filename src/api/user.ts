import backendService from "@/api/service";

export interface ProfileData {
  extractedParameters: {
    avatar: string;
    displayName: string;
    fullName: string;
  };
  providerHash: string;
}

export async function getProfile(): Promise<ProfileData> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await backendService<any>(`/user/profile`);
  const data = JSON.parse(response.claimInfo.context);
  return data;
}
