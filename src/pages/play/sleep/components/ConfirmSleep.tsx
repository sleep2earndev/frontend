import FadeWrapper from "@/components/animation/fade";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useSleep } from "@/pages/play/sleep/hooks/sleep-provider";

export default function ConfirmSleep() {
  const [isExpanding, setIsExpanding] = useState(false);
  const { setStep } = useSleep();

  const handleClick = () => {
    setIsExpanding(true);
    const timeout = setTimeout(() => {
      setStep("sleep");
      clearTimeout(timeout);
    }, 700);
  };

  return (
    <FadeWrapper className="p-4 flex-1 flex gap-12 flex-col items-center justify-center">
      <h2 className="text-4xl md:text-5xl font-bold text-center">
        Record Your
        <br /> Sleep
      </h2>
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.3 }}
      >
        <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></div>
        {isExpanding ? (
          <motion.div
            className="top-0 left-0 bg-primary rounded-full"
            initial={{ scale: 0, width: "80px", height: "80px" }}
            animate={{ scale: 50 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        ) : (
          <Button
            size={"icon"}
            className="w-16 h-16 text-white rounded-full relative"
            asChild={true}
          >
            <motion.div
              initial={{ scale: 1 }}
              whileTap={{ scale: 0.5 }}
              onClick={handleClick}
            >
              <PlayIcon />
            </motion.div>
          </Button>
        )}
      </motion.div>
    </FadeWrapper>
  );
}
