import React, { useEffect, useRef, useState } from "react";
import * as motion from "motion/react-client";
import { cn } from "@/lib/utils";
import { NavLink, useLocation } from "react-router";

interface BottomBarData {
  title: string | React.ReactNode;
  to: string;
  key: string;
}

interface BottomBarProps {
  data: BottomBarData[];
}

export default function BottomBar({ data }: BottomBarProps) {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const { pathname } = useLocation();

  return (
    <motion.div
      className={cn("fixed bottom-10 z-50 left-0 right-0")}
      initial={{ y: "200%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      exit={{ y: "200%", opacity: 0, transition: { duration: 0.5 } }}
    >
      <ul className="relative mx-auto flex w-fit rounded-full bg-secondary p-1 border border-white">
        {data.map((item, index) => (
          <NavLink to={item.to} key={index}>
            <Tab key={item.key} setPosition={setPosition} isActive={item.to === pathname}>
                {item.title}
              </Tab>
          </NavLink>
        ))}

        <Cursor position={position} />
      </ul>
    </motion.div>
  );
}
 
const Tab = ({
  children,
  setPosition,
  isActive,
}: {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPosition: (data: any) => void;
  isActive: boolean;
}) => {
  const ref = useRef<HTMLLIElement>(null);

  function setActive() {
    if (!ref?.current) return;

    const { width } = ref.current.getBoundingClientRect();

    setPosition({
      left: ref.current.offsetLeft,
      width,
      opacity: 1,
    });
  }

  useEffect(() => {
    if (isActive) {
      setActive();
    }
  }, [isActive]);

  return (
    <li
      ref={ref}
      // onMouseEnter={setActive}
      className="relative z-10 block cursor-pointer uppercase text-white mix-blend-difference px-5 py-3 text-base"
    >
      {children}
    </li>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Cursor = ({ position }: { position: any }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className="absolute z-0 h-12 rounded-full bg-white"
    />
  );
};
