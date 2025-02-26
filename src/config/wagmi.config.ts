import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {  sepolia } from "wagmi/chains";

const config = getDefaultConfig({
  appName: "Snoorefi",
  projectId: import.meta.env.VITE_PROJECT_ID,
  chains: [sepolia],
  ssr: false,
});

export default config;
