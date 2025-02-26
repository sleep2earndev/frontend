import backendService from "@/api/service";

export async function getProfile() {
  const response = await backendService(`/user/profile`);
  console.log(response);
}
