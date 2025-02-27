import type React from "react";
import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeProps {
  children: React.ReactNode;
  onSwipe: () => void;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface SwipeRef {
  reset: () => void;
}

const Swipe = forwardRef<SwipeRef, SwipeProps>(({ children, onSwipe, ...props }, ref) => {
  const [sliding, setSliding] = useState(false);
  const [, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const progressRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (isSuccess) return;
    setSliding(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    startXRef.current = clientX - (currentXRef.current || 0);
  };

  const handleTouchMove = useCallback((e: TouchEvent | MouseEvent) => {
    if (!sliding || isSuccess) return;

    const clientX = "touches" in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const containerWidth = containerRef.current?.offsetWidth ?? 0;
    const sliderWidth = sliderRef.current?.offsetWidth ?? 0;
    const maxTravel = containerWidth - sliderWidth;

    let travel = clientX - startXRef.current;
    travel = Math.max(0, Math.min(travel, maxTravel));

    currentXRef.current = travel;
    progressRef.current = (travel / maxTravel) * 100;
    setProgress(progressRef.current);

    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(${travel}px)`;
    }

    if (!isSuccess && progressRef.current >= 95) {
      handleSuccess();
    }
  }, [sliding, isSuccess]);

  const handleTouchEnd = useCallback(() => {
    if (!sliding || isSuccess) return;
    setSliding(false);

    if (progressRef.current < 95) {
      reset();
    }
  }, [sliding, isSuccess]);

  const handleSuccess = () => {
    if (isSuccess) return;
    setSliding(false);
    setIsSuccess(true);
    onSwipe();
  };

  const reset = () => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = "translateX(0px)";
    }
    currentXRef.current = 0;
    progressRef.current = 0;
    setProgress(0);
    setIsSuccess(false);
  };

  useImperativeHandle(ref, () => ({ reset }));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleTouchMove(e);
    const handleMouseUp = () => handleTouchEnd();

    if (sliding) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [sliding, handleTouchMove, handleTouchEnd]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        reset();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "max-w-md bg-white rounded-md relative overflow-hidden",
        props.className
      )}
    >
      <div
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={(e) => handleTouchMove(e.nativeEvent)}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        className="absolute left-1 top-1 bottom-1 bg-primary rounded-md transition-transform duration-200 cursor-grab active:cursor-grabbing"
        style={{ width: "4rem" }}
      >
        <div className="h-full flex items-center justify-center text-white">
          <ChevronRight className="w-4 h-4" />
          <ChevronRight className="w-4 h-4 -ml-2" />
        </div>
      </div>
      <div className="py-4 px-6 text-center text-gray-600 font-medium">
        {children}
      </div>
    </div>
  );
});

export default Swipe;
