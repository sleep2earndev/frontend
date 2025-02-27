import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { WagmiProvider } from "wagmi";

import config from "@/config/wagmi.config.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "@/components/ui/sonner.tsx";
import { LoadingProvider } from "@/components/loading-provider.tsx";
import { ProfileProvider, ProfileWrapper } from "@/hooks/account-provider.tsx";
import { SleepProvider } from "./hooks/sleep-provider.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ThemeProvider defaultTheme="dark" storageKey="snoorefi-ui-theme">
            <BrowserRouter>
              <SleepProvider>
                <LoadingProvider>
                  <ProfileProvider>
                    <ProfileWrapper>
                      <App />
                    </ProfileWrapper>
                    <Toaster richColors />
                  </ProfileProvider>
                </LoadingProvider>
              </SleepProvider>
            </BrowserRouter>
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
