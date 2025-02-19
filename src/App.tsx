import "./App.css";
import { Route, Routes } from "react-router";
import LandingPage from "@/pages";
import HomePage from "@/pages/play/home";
import SleepPage from "@/pages/play/sleep";
import LeaderBoardPage from "@/pages/play/competition/Leaderboard";
import MarketplacePage from "@/pages/play/marketplace";
import MarketplaceDetailPage from "@/pages/play/marketplace/detail";

import PlayLayout from "@/components/layout/PlayLayout";
import ProfilePage from "./pages/play/profile";
import WalletPage from "./pages/play/wallet";
import { AnimatePresence } from "motion/react";

function App() {
  return (
    <AnimatePresence>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="play" element={<PlayLayout />}>
          <Route index element={<HomePage />} />
          <Route path="sleep" element={<SleepPage />} />
          <Route path="competition/leaderboard" element={<LeaderBoardPage />} />
          <Route path="marketplace">
            <Route index element={<MarketplacePage />} />
            <Route path="detail" element={<MarketplaceDetailPage />} />
          </Route>
          <Route path="wallet">
            <Route index element={<WalletPage />} />
          </Route>
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
