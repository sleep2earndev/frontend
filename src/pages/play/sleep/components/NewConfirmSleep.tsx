import { useState } from "react";
import { motion } from "motion/react";
import {
  Clock,
  Bell,
  Moon,
  Sun,
  Zap,
  ArrowRight,
  Plus,
  Minus,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CategorySleep, useSleep } from "@/hooks/sleep-provider";
import { Particles } from "@/components/magicui/particles";
import { getCurrentDate } from "@/lib/utils";
import useLeaveConfirmation from "@/hooks/use-leave-confirmation";
import useEnergy from "@/hooks/use-energy";

export default function NewConfirmSleep() {
  const { data, setData, setStep } = useSleep();
  const category: CategorySleep = data.category || "night-sleep";
  const recomendationWording: Record<CategorySleep, string> = {
    "night-sleep": "Recommended: 6-8 hours for adults",
    "day-nap": "20-30 minutes for optimal alertness",
    "power-nap": "10-20 minutes to avoid deep sleep",
  };

  // Default duration based on category
  const getDefaultDuration = () => {
    switch (category) {
      case "night-sleep":
        return 8 * 60; // 8 hours in minutes
      case "day-nap":
        return 30; // 30 minutes
      case "power-nap":
        return 20; // 20 minutes
      default:
        return 8 * 60;
    }
  };

  const { updateEnergyUsed } = useEnergy();

  const [duration, setDuration] = useState(getDefaultDuration());
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  useLeaveConfirmation({
    isBlocked: true,
  });

  const calculateEndTime = () => {
    const now = new Date();
    const endTimeDate = new Date(now.getTime() + duration * 60 * 1000);

    // Format waktu yang bisa dibaca manusia
    const day = endTimeDate.getDate();
    const month = endTimeDate.toLocaleString("en-US", { month: "short" });
    const year = endTimeDate.getFullYear();
    const hours = endTimeDate.getHours().toString().padStart(2, "0");
    const minutes = endTimeDate.getMinutes().toString().padStart(2, "0");
    const formattedTime = `${day} ${month} ${year} ${hours}:${minutes}`;

    // Mendapatkan offset timezone dalam menit
    const timezoneOffset = -endTimeDate.getTimezoneOffset();
    const offsetHours = Math.floor(timezoneOffset / 60);
    const offsetMinutes = timezoneOffset % 60;
    const offsetSign = offsetHours >= 0 ? "+" : "-";
    const formattedOffset = `${offsetSign}${String(
      Math.abs(offsetHours)
    ).padStart(2, "0")}:${String(Math.abs(offsetMinutes)).padStart(2, "0")}`;

    // Format raw (ISO dengan timezone lokal, bukan UTC)
    const datePart = endTimeDate.toISOString().split("T")[0]; // Ambil YYYY-MM-DD
    const timePart = endTimeDate
      .toLocaleTimeString("sv-SE", { hour12: false }) // Format 24 jam
      .replace(",", "."); // Untuk menghindari format dengan koma

    const rawTime = `${datePart}T${timePart}${formattedOffset}`;

    return {
      format: formattedTime,
      raw: rawTime,
    };
  };

  // Format duration for display
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ""}`;
    }
    return `${mins}m`;
  };

  // Get category details
  const getCategoryDetails = () => {
    switch (category) {
      case "night-sleep":
        return {
          name: "Night Sleep",
          icon: <Moon className="h-6 w-6" />,
          color: "text-primary",
          bgColor: "bg-primary/20",
          shadow: "shadow-neon-purple",
          minDuration: 1 * 60, // 6 hours
          maxDuration: 10 * 60, // 10 hours
          step: 30, // 30 minute increments
        };
      case "day-nap":
        return {
          name: "Day Nap",
          icon: <Sun className="h-6 w-6" />,
          color: "text-orange-500",
          bgColor: "bg-orange-500/20",
          shadow: "shadow-[0_0_10px_rgba(249,115,22,0.5)]",
          minDuration: 20, // 20 minutes
          maxDuration: 40, // 40 minutes
          step: 5, // 5 minute increments
        };
      case "power-nap":
        return {
          name: "Power Nap",
          icon: <Zap className="h-6 w-6" />,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/20",
          shadow: "shadow-[0_0_10px_rgba(234,179,8,0.5)]",
          minDuration: 10, // 10 minutes
          maxDuration: 20, // 20 minutes
          step: 5, // 5 minute increments
        };
      default:
        return {
          name: "Night Sleep",
          icon: <Moon className="h-6 w-6" />,
          color: "text-primary",
          bgColor: "bg-primary/20",
          shadow: "shadow-neon-purple",
          minDuration: 1 * 60,
          maxDuration: 10 * 60,
          step: 30,
        };
    }
  };

  const categoryDetails = getCategoryDetails();

  // Handle duration adjustment
  const adjustDuration = (increment: boolean) => {
    if (increment) {
      setDuration((prev) =>
        Math.min(prev + categoryDetails.step, categoryDetails.maxDuration)
      );
    } else {
      setDuration((prev) =>
        Math.max(prev - categoryDetails.step, categoryDetails.minDuration)
      );
    }
  };

  // Start sleep recording with the configured settings
  const startSleepRecording = () => {
    const targetEndTime = calculateEndTime().raw;
    setData({
      alarmEnabled,
      targetEndTime,
      startTime: getCurrentDate(),
    });
    setStep("sleep");
    updateEnergyUsed();
  };

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      {/* Background Effects */}
      <Particles
        className="absolute inset-0 z-0"
        quantity={200}
        ease={80}
        color={"#fff"}
        refresh
      />

      <div className="relative z-10 flex flex-1 flex-col p-6 pb-24">
        <div className="mb-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold"
          >
            Set Sleep Schedule
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-foreground/60"
          >
            Configure your sleep duration and alarm
          </motion.p>
        </div>

        {/* Selected Category */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div
            className={`flex items-center gap-2 rounded-full ${categoryDetails.bgColor} px-4 py-2 ${categoryDetails.shadow} w-fit mx-auto`}
          >
            {categoryDetails.icon}
            <span className={`font-medium ${categoryDetails.color}`}>
              {categoryDetails.name}
            </span>
          </div>
        </motion.div>

        {/* Start Time Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 rounded-xl bg-muted/50 p-6 backdrop-blur-sm"
        >
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium">Start Time</h2>
          </div>

          <div className="text-center">
            <p className="text-foreground/70">
              Sleep will start immediately when you press the Start button
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-foreground/60">
              <Calendar className="h-4 w-4" />
              <span>
                Today,{" "}
                {new Date().toLocaleDateString([], {
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Duration Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 rounded-xl bg-muted/50 p-6 backdrop-blur-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-secondary" />
              <h2 className="text-lg font-medium">Duration</h2>
            </div>
          </div>
          <div className="text-sm text-foreground/60 text-center mb-4">
            Ends at <strong>{calculateEndTime().format}</strong>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustDuration(false)}
              disabled={duration <= categoryDetails.minDuration}
              className="rounded-full border-foreground/10 hover:bg-secondary/20 hover:text-secondary"
            >
              <Minus className="h-5 w-5" />
            </Button>

            <div className="flex h-12 min-w-[100px] items-center justify-center rounded-full bg-accent/20 px-4 text-lg font-semibold text-accent">
              {formatDuration(duration)}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustDuration(true)}
              disabled={duration >= categoryDetails.maxDuration}
              className="rounded-full border-foreground/10 hover:bg-secondary/20 hover:text-secondary"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          <div className=" text-center text-sm text-foreground/20 mt-4">
            {recomendationWording[category]}
          </div>
        </motion.div>

        {/* Alarm Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 rounded-xl bg-muted/50 p-6 backdrop-blur-sm"
        >
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-medium">Alarm Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="alarm-toggle" className="text-sm">
                  Enable Alarm
                </Label>
              </div>
              <Switch
                id="alarm-toggle"
                checked={alarmEnabled}
                onCheckedChange={setAlarmEnabled}
              />
            </div>
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button onClick={startSleepRecording} size={"lg"} className="w-full">
            <div className="flex items-center justify-center gap-2">
              <span>Start Sleep</span>
              <ArrowRight className="h-5 w-5" />
            </div>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
