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

export async function claimEarn({ startDate, endDate }: { startDate: string, endDate: string }): Promise<{ success: boolean, earn: number, [k: string]: any }> {
  const response = await backendService<{ success: boolean, earn: number, [k: string]: any }>(`/user/v2/get-earn`, {
    body: JSON.stringify({ startDate, endDate }),
    method: 'POST'
  });
  return response;
}