import { Outlet } from "react-router";

export default function PlayLayout() {
  return (
    <div className="play-layout">
      <div className="play-layout__container">
        <Outlet />
      </div>
    </div>
  );
}
