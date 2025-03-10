import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Tambah 1 karena bulan dimulai dari 0
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getAttributes(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { trait_type: string; value: any }[],
  attrName: string
) {
  if (!Array.isArray(data) || (data || []).length < 1) return "";
  return data.find((attr) => attr.trait_type === attrName)?.value;
}
