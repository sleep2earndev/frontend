import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { monadTestnet } from "wagmi/chains";

const config = getDefaultConfig({
  appName: "NapNad",
  projectId: import.meta.env.VITE_PROJECT_ID,
  chains: [monadTestnet],
  ssr: false,
});

export default config;
