/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const response = await backendService<any>(`/user/profile`);
  const data = JSON.parse(response.claimInfo.context);
  return data;
}

interface PayloadClaimEarn {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  maxEnergy: number;
}

export async function claimEarn(payload: PayloadClaimEarn): Promise<{ success: boolean; earn: number;[k: string]: any }> {
  const response = await backendService<{
    success: boolean;
    earn: number;
    [k: string]: any;
  }>(`/user/v2/get-earn`, {
    body: JSON.stringify(payload),
    method: "POST",
  });
  return response;
}


export async function logout(): Promise<ProfileData> {
  const response = await backendService<any>(`/user/logout`, {
    method: 'DELETE'
  });
  return response;
}