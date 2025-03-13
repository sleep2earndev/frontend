import { useEffect, useState } from "react";
import {
  ArrowRight,
  Award,
  BarChart2,
  Bot,
  BotMessageSquare,
  Check,
  Clock,
  Loader2,
  Moon,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SleepData, useSleep } from "@/hooks/sleep-provider";
import { useNavigate } from "react-router";
import FadeWrapper from "@/components/animation/fade";
import useLeaveConfirmation from "@/hooks/use-leave-confirmation";
import useCurrency from "@/hooks/useCurrency";
import { useMutation } from "@tanstack/react-query";
import { getAIChat } from "@/api/ai";
import Markdown from "react-markdown";
import { cn } from "@/lib/utils";

// Definisikan warna dan label untuk setiap tahap tidur
const sleepStageConfig = {
  deep: { color: "bg-indigo-600 shadow-neon-purple", label: "Deep Sleep" },
  light: { color: "bg-blue-400", label: "Light Sleep" },
  rem: { color: "bg-accent shadow-neon-pink", label: "REM Sleep" },
  wake: { color: "bg-foreground/30", label: "Wake Time" },
  asleep: { color: "bg-primary shadow-neon-purple", label: "Asleep" },
  awake: { color: "bg-gray-500", label: "Fully Awake" },
  restless: { color: "bg-amber-400", label: "Restless" },
};

export default function NewSuccessClaim() {
  const navigate = useNavigate();
  const { data, clearData, setStep, chatCoach, setChatCoach } = useSleep();
  const [isAnimating, setIsAnimating] = useState(true);

  const { fromWeiToEth } = useCurrency();

  useLeaveConfirmation({
    isBlocked: true,
  });

  // Format duration to hours and minutes
  const hours = Math.floor(data.duration / 3600000); // Konversi ke jam
  const minutes = Math.floor((data.duration % 3600000) / 60000); // Sisa menit
  const formattedDuration = `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`;

  function backToHomepage() {
    navigate("/play", { replace: true });
    setStep("choose-category");
    clearData();
  }

  const formatCoinForUI = (value: number) => {
    const _value = fromWeiToEth(value);
    return _value < 0.00000001
      ? "< 0.00000001" // Batas bawah tampilan UI
      : _value.toFixed(10);
  };

  const sleepData = data.sleepData || ({} as SleepData);

  // Calculate sleep quality score (example algorithm)
  const sleepQualityScore = Math.min(
    100,
    Math.round(
      sleepData.efficiency * 0.4 +
        (sleepData.minutesAsleep >= 420 ? 30 : sleepData.minutesAsleep / 14) +
        (sleepData.minutesAwake === 0 ? 30 : 30 - sleepData.minutesAwake / 2)
    )
  );

  // Format start and end times
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const startTime = formatTime(sleepData.startTime);
  const endTime = formatTime(sleepData.endTime);

  // Fungsi untuk mendapatkan tahap tidur yang tersedia
  const getAvailableSleepStages = () => {
    return (
      Object.entries(sleepData?.summary || {})
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, value]) => value && value.minutes !== undefined)
        .map(([key, value]) => ({
          key,
          ...value,
        }))
    );
  };

  // Mendapatkan tahap tidur yang tersedia
  const availableSleepStages = getAvailableSleepStages();

  // Menghitung total menit tidur
  const totalSleepMinutes = availableSleepStages.reduce(
    (total, stage) => total + stage.minutes,
    0
  );

  // Menghitung persentase untuk setiap tahap tidur
  const sleepStagePercentages = availableSleepStages.reduce((acc, stage) => {
    acc[stage.key] = Math.round((stage.minutes / totalSleepMinutes) * 100);
    return acc;
  }, {} as Record<string, number>);

  const { isPending, mutate, isError } = useMutation({
    retry: false,
    mutationFn: getAIChat,
    onSuccess(data) {
      setChatCoach((prev) => [...prev, data]);
    },
  });

  useEffect(() => {
    mutate([{ role: chatCoach[0]?.role, content: chatCoach[0]?.content }]);
  }, []);

  return (
    <FadeWrapper className="flex flex-col flex-1 items-center justify-center bg-[#061029] bg-gradient-to-b from-background to-background/95 text-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-4 rounded-full bg-emerald-500/20 p-4"
          >
            <Award className="h-12 w-12 text-emerald-500" />
          </motion.div>
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-2 text-3xl font-bold"
          >
            Success!
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-white/70"
          >
            You've completed your sleep session
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="mb-6 overflow-hidden border-0 bg-white/5 text-white shadow-lg">
            <CardContent className="relative p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              <div className="relative">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-white/70">
                    Total Earned
                  </h2>
                  <div className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary shadow-neon-purple">
                    MON
                  </div>
                </div>
                <div className="mb-4 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="text-4xl font-bold"
                    >
                      {formatCoinForUI(data?.earning)}
                    </motion.span>
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="text-xs text-white/40 mt-1"
                    >
                      {fromWeiToEth(data?.earning).toFixed(18)}
                    </motion.span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: isAnimating ? [0, 1, 0] : 0,
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 2,
                      repeatDelay: 0.5,
                    }}
                    onAnimationComplete={() => {
                      setTimeout(() => setIsAnimating(false), 5000);
                    }}
                    className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20"
                  >
                    <span className="text-xs text-emerald-400">+</span>
                  </motion.div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.9, duration: 1.5 }}
                    className="h-full bg-gradient-to-r from-primary to-accent"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sleep Analytics Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mb-6"
        >
          <Card className="overflow-hidden border-0 bg-muted/50 text-foreground shadow-lg backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium">Sleep Analytics</h2>
                <BarChart2 className="h-5 w-5 text-primary" />
              </div>

              {/* Sleep Quality Score */}
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-foreground/70">
                    Sleep Quality Score
                  </span>
                  <span className="font-medium">{sleepQualityScore}/100</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sleepQualityScore}%` }}
                    transition={{ delay: 1, duration: 1 }}
                    className={`h-full ${
                      sleepQualityScore >= 80
                        ? "bg-emerald-500"
                        : sleepQualityScore >= 60
                        ? "bg-yellow-500"
                        : "bg-secondary"
                    }`}
                  />
                </div>
                {sleepQualityScore >= 80 && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-emerald-500">
                    <Check className="h-3 w-3" /> Excellent sleep quality
                  </div>
                )}
              </div>

              {/* Sleep Metrics */}
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted p-3">
                  <div className="mb-1 text-xs text-foreground/60">
                    Sleep Duration
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium">{formattedDuration}</span>
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <div className="mb-1 text-xs text-foreground/60">
                    Sleep Efficiency
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-accent" />
                    <span className="font-medium">{sleepData.efficiency}%</span>
                  </div>
                </div>
              </div>

              {/* Sleep Time */}
              <div className="mb-4 rounded-lg bg-muted p-3">
                <div className="mb-2 text-xs text-foreground/60">
                  Sleep Time
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Moon className="h-4 w-4 text-primary" />
                    <span className="text-sm">{startTime}</span>
                  </div>
                  <div className="h-px flex-1 bg-foreground/10 px-2"></div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">{endTime}</span>
                    <Moon className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>

              {/* Sleep Stages Visualization */}
              {!!availableSleepStages.length && (
                <div className="rounded-lg bg-muted p-4">
                  <div className="mb-3 text-sm font-medium">Sleep Stages</div>

                  {/* Sleep Stages Bar */}
                  <div className="mb-4 h-4 overflow-hidden rounded-full">
                    <div className="flex h-full w-full">
                      {availableSleepStages.map((stage, index) => {
                        const stageKey =
                          stage.key as keyof typeof sleepStageConfig;
                        const percentage = sleepStagePercentages[stage.key];
                        const delay = 1.1 + index * 0.1;

                        return (
                          <motion.div
                            key={stage.key}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay, duration: 0.8 }}
                            className={
                              sleepStageConfig[stageKey]?.color || "bg-gray-400"
                            }
                            style={{ width: `${percentage}%` }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Sleep Stages Details */}
                  <div className="grid grid-cols-2 gap-3">
                    {availableSleepStages.map((stage) => {
                      const stageKey =
                        stage.key as keyof typeof sleepStageConfig;
                      const percentage = sleepStagePercentages[stage.key];

                      return (
                        <div
                          key={stage.key}
                          className="rounded-md bg-muted/80 p-2"
                        >
                          <div className="mb-1 flex items-center gap-1.5">
                            <div
                              className={`h-2.5 w-2.5 rounded-full ${
                                sleepStageConfig[stageKey]?.color ||
                                "bg-gray-400"
                              }`}
                            ></div>
                            <span className="text-xs font-medium">
                              {sleepStageConfig[stageKey]?.label || stage.key}
                            </span>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <span className="text-lg font-semibold">
                              {stage.minutes}
                            </span>
                            <span className="text-xs text-foreground/60">
                              min ({percentage}%)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sleep Coach Section */}
        {!isError && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mb-6"
          >
            <Card className="relative overflow-hidden border-0 bg-muted/50 text-foreground shadow-lg backdrop-blur-sm">
              {/* Decorative elements */}
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl"></div>
              <div className="absolute -left-10 bottom-0 h-20 w-20 rounded-full bg-secondary/10 blur-2xl"></div>

              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-medium">Sleep Coach</h2>
                  <div className="rounded-full bg-emerald-500/20 p-1 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                    <Bot className="h-4 w-4 text-emerald-500" />
                  </div>
                </div>

                <div className="mb-4 rounded-lg bg-gradient-to-br from-emerald-500/10 to-primary/10 p-4 backdrop-blur-sm">
                  <div
                    className={cn("flex gap-3", {
                      "items-center": isPending,
                      "items-start": !isPending,
                    })}
                  >
                    <div className="mt-1 rounded-full bg-emerald-500/20 p-1.5 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                      <Sparkles className="h-4 w-4 text-emerald-500" />
                    </div>
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-foreground/60" />
                        <span className="text-sm text-foreground/60">
                          Sleep Coach is typing...
                        </span>
                      </div>
                    ) : (
                      <div className="text-sm">
                        <Markdown>{chatCoach[1]?.content}</Markdown>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chat with Sleep Coach Button */}
                <Button
                  className="mt-2 w-full"
                  onClick={() => setStep("chat-ai")}
                >
                  <BotMessageSquare className="h-5 w-5" />
                  <span className="font-medium">Chat with Sleep Coach</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Button
            variant="outline"
            className="group relative w-full overflow-hidden border-foreground/10 bg-muted/30 py-6 text-base font-medium text-foreground transition-all hover:bg-muted/50 backdrop-blur-sm"
            onClick={backToHomepage}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            Back to Home
          </Button>
        </motion.div>
      </motion.div>
    </FadeWrapper>
  );
}
