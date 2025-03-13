import FadeWrapper from "@/components/animation/fade";
import Swipe, { SwipeRef } from "@/components/ui/swipe";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import abi from "@/abi/claim.json";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLoading } from "@/components/loading-provider";
import { useProfile } from "@/hooks/account-provider";
import { NftData } from "@/components/nft/card-nft";
import { CategorySleep, SleepData, useSleep } from "@/hooks/sleep-provider";
import useLeaveConfirmation from "@/hooks/use-leave-confirmation";
import useCurrentTime from "@/hooks/use-current-time";
import { useMutation } from "@tanstack/react-query";
import { claimEarn } from "@/api/user";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { getCurrentDate } from "@/lib/utils";
import { motion } from "motion/react";
import { AlarmClock, Clock, Moon, Sun, Zap } from "lucide-react";
import Image from "@/components/ui/image";
import useAlarm from "@/hooks/use-alarm";
import { parseEther } from "viem";
import { v4 as uuid } from "uuid";

const getCategoryDetails = (category: CategorySleep) => {
  switch (category) {
    case "night-sleep":
      return {
        name: "Night Sleep",
        icon: <Moon className="h-6 w-6 text-primary" />,
        color: "text-primary",
        bgColor: "bg-primary/20",
        shadow: "shadow-neon-purple",
      };
    case "day-nap":
      return {
        name: "Day Nap",
        icon: <Sun className="h-6 w-6 text-orange-500" />,
        color: "text-orange-500",
        bgColor: "bg-orange-500/20",
        shadow: "shadow-[0_0_10px_rgba(249,115,22,0.5)]",
      };
    case "power-nap":
      return {
        name: "Power Nap",
        icon: <Zap className="h-6 w-6 text-yellow-500" />,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/20",
        shadow: "shadow-[0_0_10px_rgba(234,179,8,0.5)]",
      };
    default:
      return {
        name: "Night Sleep",
        icon: <Moon className="h-6 w-6 text-primary" />,
        color: "text-primary",
        bgColor: "bg-primary/20",
        shadow: "shadow-neon-purple",
      };
  }
};

// Format time as HH:MM
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Format elapsed time as HH:MM:SS
const formatElapsedTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export default function NewSleep() {
  const { setAlarm, stopAlarm, isAlarmCalled } = useAlarm();
  const { setLoading } = useLoading();
  const { profile } = useProfile();
  const { data, setData, setStep, setChatCoach } = useSleep();
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds

  const currentTime = useCurrentTime();
  const categoryDetails = getCategoryDetails(data.category as CategorySleep);

  useLeaveConfirmation({
    isBlocked: true,
  });

  const swipeRef = useRef<SwipeRef>(null);
  const [openNotifWallet, setOpenNotifWallet] = useState(false);

  const { writeContract, data: hash } = useWriteContract({
    mutation: {
      onError(error) {
        console.log("[ERROR WALLET]: ", error);
        toast.error("The transaction has been canceled.");
        swipeRef.current?.reset?.();
        setLoading(false);
      },
      onSuccess() {
        setOpenNotifWallet(false);
      },
    },
  });
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
    retryCount: 0,
    query: {
      retryOnMount: false,
    },
  });

  const selectedNFT = useMemo<NftData | null>(() => {
    const selected = localStorage.getItem("nft-selected");
    if (selected) {
      const data = JSON.parse(selected);
      return data as NftData;
    }

    return null;
  }, []);

  const { mutateAsync } = useMutation({
    retry: false,
    mutationFn: claimEarn,
    onSuccess(data) {
      if (!data.success || !data.earn) {
        setLoading(false);
        setStep("failed");
        setOpenNotifWallet(false);
        return;
      }
      setOpenNotifWallet(true);
      const extractedParameters = data.sleep.claimInfo.context;
      setData({
        earning: data.earn,
        duration: extractedParameters.duration,
        sleepData: extractedParameters as SleepData,
      });
      setChatCoach([
        {
          id: uuid(),
          role: "user",
          content: `Can you give me short suggestions on what I should improve? Here is my sleep data, dont mention all milliseconds data, please convert it to hours or comfort data to read ${JSON.stringify(
            extractedParameters
          )}`,
          timestamp: Math.floor(Date.now() / 1000),
        },
      ]);

      claimReward(data.earn);
    },
    onError(error) {
      console.warn(error);
      toast.error("Get earning data failed, please try again");
      swipeRef.current?.reset?.();
      setLoading(false);
      setOpenNotifWallet(false);
    },
  });

  function claimReward(weiAmount: number) {
    const _weiAmount = parseEther(`${weiAmount}`);
    writeContract({
      abi,
      address: import.meta.env.VITE_ADDRESS_CLAIM,
      functionName: "claimReward",
      args: [_weiAmount],
    });
  }

  function retryClaim() {
    if (data.earning === 0) {
      toast.warning("There is no reward remaining for you to claim.");
      return;
    }
    claimReward(data.earning as number);
  }

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);

    const datePart = date.toISOString().split("T")[0]; // "2025-03-11"
    const timePart = date.toISOString().split("T")[1].slice(0, 5); // "05:53"

    return { date: datePart, time: timePart };
  };

  async function handleClaim() {
    stopAlarm();
    setLoading(true);
    const endDateIso = getCurrentDate();
    const { date: startDate, time: startTime } = formatDateTime(data.startTime);
    const { date: endDate, time: endTime } = formatDateTime(endDateIso);
    await mutateAsync({
      startDate,
      endDate,
      startTime,
      endTime,
      maxEnergy:
        Number(selectedNFT?.maxEnergy) || 0,
    });
    setData({
      endTime: endDate,
    });
  }

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isSuccess) {
      setStep("success");
    }
  }, [isSuccess]);

  // Update clock
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    
    if (data.alarmEnabled) {
      setAlarm(data.targetEndTime);
    }

    return () => stopAlarm();
  }, []);

  return (
    <FadeWrapper className="flex-1 flex flex-col relative">
      <div className="flex flex-col gap-4 relative z-10 flex-1 items-center">
        <Modal
          open={openNotifWallet}
          onOpenChange={setOpenNotifWallet}
          title="Processing Transaction, Please Wait"
        >
          <p>
            Make sure to accept the transaction in your wallet to get your
            reward. If you have dismissed the confirmation popup, you can always
            reclaim your reward by clicking the 'Retry Claim Reward' button.
          </p>
          <Button className="w-full mt-8" onClick={retryClaim}>
            Retry Claim Reward
          </Button>
        </Modal>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-center"
        >
          <h1 className="text-foreground/60 mb-4">
            Happy Sleep,{" "}
            {profile?.extractedParameters?.fullName?.split(" ")?.[0]}!
          </h1>
          <h2 className="text-6xl font-bold text-center">{currentTime}</h2>
        </motion.div>
        {/* Sleep Category */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className={`mb-8 flex items-center gap-2 rounded-full ${categoryDetails.bgColor} px-4 py-2 ${categoryDetails.shadow}`}
        >
          {categoryDetails.icon}
          <span className={`font-medium ${categoryDetails.color}`}>
            {categoryDetails.name}
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 w-full"
        >
          <div className="overflow-hidden rounded-2xl bg-muted/30 p-1 backdrop-blur-sm">
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src={selectedNFT?.token?.image}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
                <h3 className="font-medium">{selectedNFT?.token?.name}</h3>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Elapsed Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 rounded-xl bg-muted px-6 py-4 backdrop-blur-sm"
        >
          <Clock className="h-5 w-5 text-primary" />
          <div>
            <div className="text-sm text-foreground/60">Elapsed Time</div>
            <div className="text-xl font-semibold">
              {formatElapsedTime(elapsedTime)}
            </div>
          </div>
        </motion.div>

        {/* Alarm Info */}
        {data.alarmEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 rounded-xl bg-muted px-6 py-4 backdrop-blur-sm"
          >
            <div className="relative">
              <AlarmClock className="h-5 w-5 text-accent" />
              <span className="absolute -right-1 -top-1 flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
            </div>
            <div>
              <div className="text-sm text-foreground/60">Alarm Set For</div>
              <div className="text-xl font-semibold">
                {formatTime(new Date(data.targetEndTime))}
              </div>
            </div>
          </motion.div>
        )}
        <Modal
          title=""
          open={isAlarmCalled}
          onOpenChange={(open: boolean) => {
            if (!open) {
              handleClaim();
            }
          }}
        >
          <div className="relative overflow-hidden p-6">
            <div className="mb-8 flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                className="mb-4 rounded-full bg-secondary/20 p-4 shadow-neon-pink"
              >
                <AlarmClock className="h-12 w-12 text-secondary animate-pulse" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2 text-2xl font-bold"
              >
                Wake Up Time!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-foreground/70"
              >
                Your {categoryDetails.name} session is complete
              </motion.p>
            </div>

            <div className="grid gap-4">
              <Swipe ref={swipeRef} className="flex-1" onSwipe={handleClaim}>
                Swipe to Stop!
              </Swipe>
            </div>
          </div>
        </Modal>
      </div>
      <FadeWrapper className="flex justify-center left-6 right-6 bottom-6 sticky z-10 mt-8">
        <Swipe ref={swipeRef} className="flex-1" onSwipe={handleClaim}>
          Swipe to Wake Up!
        </Swipe>
      </FadeWrapper>
    </FadeWrapper>
  );
}
