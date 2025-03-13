import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrentDate() {
  const date = new Date();

  // Mendapatkan bagian tanggal dalam format ISO tanpa UTC
  const datePart = date.toISOString().split("T")[0];

  // Mendapatkan waktu dalam zona waktu lokal
  const timePart = date
    .toLocaleTimeString("sv-SE", { hour12: false }) // Format 24 jam
    .replace(",", "."); // Jika ada pemisah desimal koma

  // Mendapatkan offset timezone dalam menit
  const timezoneOffset = -date.getTimezoneOffset();
  const offsetHours = Math.floor(timezoneOffset / 60);
  const offsetMinutes = timezoneOffset % 60;

  // Format offset ke bentuk ±hh:mm
  const offsetSign = offsetHours >= 0 ? "+" : "-";
  const formattedOffset = `${offsetSign}${String(
    Math.abs(offsetHours)
  ).padStart(2, "0")}:${String(Math.abs(offsetMinutes)).padStart(2, "0")}`;

  return `${datePart}T${timePart}${formattedOffset}`;
}

export function getTimezone() {
  const date = new Date();
  const timezoneOffset = -date.getTimezoneOffset() / 60;
  return `${timezoneOffset >= 0 ? "+" : ""}${timezoneOffset}`;
}

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000); // Konversi ke milidetik
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${year} ${hours}:${minutes}`;
};

export function getAttributes(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { trait_type: string; value: any }[],
  attrName: string
) {
  if (!Array.isArray(data) || (data || []).length < 1) return "";
  return data.find((attr) => attr.trait_type === attrName)?.value;
}


export function convertIpfsToHttp(url: string, gateway = "https://ipfs.io/ipfs/") {
  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", gateway);
  }
  return url; // Jika bukan IPFS, kembalikan URL asli
}