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

