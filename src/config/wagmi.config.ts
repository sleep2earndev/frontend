import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";

const config = getDefaultConfig({
  appName: "Snoorefi",
  projectId: import.meta.env.VITE_PROJECT_ID,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false,
});

export default config;
