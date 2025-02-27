import { Outlet, useLocation } from "react-router";
import BottomBar from "@/components/ui/bottom-bar";
import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import IconHome from "@/components/icon/home";
import IconLeaderboard from "@/components/icon/leaderboard";
import IconMarketplace from "@/components/icon/marketplace";
import ProfileBar from "@/components/ui/profile-bar";
import BackBar from "@/components/ui/back-bar";

const navbar = [
  {
    title: <IconHome />,
    to: "/play",
    key: 'home'
  },
  {
    title: <IconLeaderboard />,
    to: "/play/competition/leaderboard",
    key: 'leaderboard'
  },
  {
    title: <IconMarketplace />,
    to: "/play/marketplace",
    key: 'marketplace'
  },
];

export default function PlayLayout() {
  const [bottomBarVisible, setBottomBarVisible] = useState(true);
  const [profileHeaderVisible, setProfileHeaderVisible] = useState(true);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/play/sleep')) {
      setBottomBarVisible(false)
      setProfileHeaderVisible(false)
    } else {
      setBottomBarVisible(true)
      setProfileHeaderVisible(true)
    }
  }, [location.pathname])

  return (
    <div className="play-layout">
      <div className="play-layout__container">
        <AnimatePresence>
          {profileHeaderVisible ? <ProfileBar /> : <BackBar />}
        </AnimatePresence>
        <Outlet />
        <AnimatePresence>
          {bottomBarVisible && <BottomBar data={navbar} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
