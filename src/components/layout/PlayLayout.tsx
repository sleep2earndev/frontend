import { Outlet } from "react-router";
import BottomBar from "@/components/ui/bottom-bar";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import IconHome from "@/components/icon/home";
import IconLeaderboard from "@/components/icon/leaderboard";
import IconMarketplace from "@/components/icon/marketplace";
import ProfileBar from "../ui/profile-bar";

const navbar = [
  {
    title: <IconHome />,
    to: "/play",
  },
  {
    title: <IconLeaderboard />,
    to: "/play/competition/leaderboard",
  },
  {
    title: <IconMarketplace />,
    to: "/play/marketplace",
  },
];

export default function PlayLayout() {
  const [bottomBarVisible, setBottomBarVisible] = useState(true);

  return (
    <div className="play-layout">
      <div className="play-layout__container">
        <ProfileBar/>
        <Outlet />
        <AnimatePresence>
          {bottomBarVisible && <BottomBar data={navbar} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
