import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Send,
  Brain,
  Moon,
  Clock,
  Zap,
  Bot,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAIChat, Message } from "@/api/ai";
import { formatTimestamp } from "@/lib/utils";
import Markdown from "react-markdown";
import { useSleep } from "@/hooks/sleep-provider";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useLeaveConfirmation from "@/hooks/use-leave-confirmation";

// Ubah definisi komponen untuk menerima props
export default function ChatWithAi() {
  // Gunakan data default jika tidak ada data yang diberikan
  const defaultSleepData = {
    dateOfSleep: "2025-02-16",
    duration: 28800000,
    efficiency: 100,
    endTime: "2025-02-16T21:24:00.000",
    startTime: "2025-02-16T13:24:00.000",
    minutesAsleep: 480,
    minutesAwake: 0,
    timeInBed: 480,
    summary: {
      deep: { count: 4, minutes: 46, thirtyDayAvgMinutes: 0 },
      light: { count: 19, minutes: 133, thirtyDayAvgMinutes: 0 },
      rem: { count: 8, minutes: 81, thirtyDayAvgMinutes: 0 },
      wake: { count: 21, minutes: 40, thirtyDayAvgMinutes: 0 },
    },
  };

  const navigate = useNavigate();

  const { chatCoach, setChatCoach, data, setStep, clearData } = useSleep();

  useLeaveConfirmation({
    isBlocked: true,
  });

  const sleepData = data.sleepData;

  const sleepSummary = sleepData?.summary || defaultSleepData.summary;
  const efficiency = sleepData?.efficiency || defaultSleepData.efficiency;
  const minutesAsleep =
    sleepData?.minutesAsleep || defaultSleepData.minutesAsleep;

  // Format durasi tidur
  const hours = Math.floor(minutesAsleep / 60);
  const minutes = minutesAsleep % 60;
  const formattedDuration = `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`;

  // Fungsi untuk mendapatkan tahap tidur yang tersedia
  const getAvailableSleepStages = () => {
    return (
      Object.entries(sleepSummary)
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

  // Konfigurasi untuk tampilan tahap tidur
  const sleepStageConfig = {
    deep: {
      icon: <Brain className="h-4 w-4 text-indigo-600" />,
      label: "Deep Sleep",
      color: "text-indigo-600",
    },
    light: {
      icon: <Moon className="h-4 w-4 text-blue-400" />,
      label: "Light Sleep",
      color: "text-blue-400",
    },
    rem: {
      icon: <Moon className="h-4 w-4 text-secondary" />,
      label: "REM Sleep",
      color: "text-secondary",
    },
    wake: {
      icon: <Clock className="h-4 w-4 text-foreground/70" />,
      label: "Wake Time",
      color: "text-foreground/70",
    },
    asleep: {
      icon: <Moon className="h-4 w-4 text-primary" />,
      label: "Asleep",
      color: "text-primary",
    },
    awake: {
      icon: <Clock className="h-4 w-4 text-gray-500" />,
      label: "Fully Awake",
      color: "text-gray-500",
    },
    restless: {
      icon: <Zap className="h-4 w-4 text-amber-400" />,
      label: "Restless",
      color: "text-amber-400",
    },
  };

  // Initial messages to show example conversation

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isPending, mutate } = useMutation({
    retry: false,
    mutationFn: getAIChat,
    onSuccess(data) {
      setChatCoach((prev) =>
        [...prev, data].filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
        )
      );
    },
  });

  const messages = chatCoach
    .filter((_data, index) => index !== 0)
    .filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    );

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatCoach]);

  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: "user",
      timestamp: Math.floor(Date.now() / 1000),
    };

    const newChat = [...chatCoach, userMessage];

    setChatCoach(newChat);

    mutate(
      newChat.map((item) => ({
        role: item.role,
        content: item.content,
      }))
    );
    setInputValue("");
  };

  function backToHomepage() {
    navigate("/play", { replace: true });
    setStep("choose-category");
    clearData();
  }

  return (
    <div className="flex min-h-screen fixed z-20 inset-0 flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-foreground/10 bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={backToHomepage}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                  <Bot className="h-5 w-5 text-emerald-500" />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                  AI
                </span>
              </div>
              <div>
                <h1 className="font-medium">Sleep Coach</h1>
                <p className="text-xs text-foreground/60">
                  AI-powered sleep insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-4 pb-20">
          {/* Ubah bagian Sleep Stats Cards untuk menggunakan data dinamis */}
          {/* Sleep Stats Cards (show at the top of the chat) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 grid grid-cols-2 gap-2"
          >
            {/* Render card untuk setiap tahap tidur yang tersedia */}
            {availableSleepStages.slice(0, 2).map((stage) => {
              const stageKey = stage.key as keyof typeof sleepStageConfig;
              const stageConfig = sleepStageConfig[stageKey] || {
                icon: <Moon className="h-4 w-4 text-foreground/70" />,
                label: stage.key,
                color: "text-foreground/70",
              };
              const percentage = sleepStagePercentages[stage.key];

              return (
                <div key={stage.key} className="rounded-xl bg-muted/50 p-3">
                  <div className="mb-1 flex items-center gap-2">
                    {stageConfig.icon}
                    <span
                      className={`text-xs font-medium ${stageConfig.color}`}
                    >
                      {stageConfig.label}
                    </span>
                  </div>
                  <p className="text-lg font-semibold">{stage.minutes} min</p>
                  <p className="text-xs text-foreground/60">
                    {percentage}% of total sleep
                  </p>
                </div>
              );
            })}

            {/* Total Sleep Card */}
            <div className="rounded-xl bg-muted/50 p-3">
              <div className="mb-1 flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-xs font-medium">Total Sleep</span>
              </div>
              <p className="text-lg font-semibold">{formattedDuration}</p>
              <p className="text-xs text-foreground/60">Recommended: 7-9h</p>
            </div>

            {/* Efficiency Card */}
            <div className="rounded-xl bg-muted/50 p-3">
              <div className="mb-1 flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-medium">Efficiency</span>
              </div>
              <p className="text-lg font-semibold">{efficiency}%</p>
              <p className="text-xs text-foreground/60">
                {efficiency >= 90
                  ? "Excellent"
                  : efficiency >= 80
                  ? "Good"
                  : "Fair"}{" "}
                quality
              </p>
            </div>
          </motion.div>

          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "rounded-tr-sm bg-primary/20 text-foreground"
                    : "rounded-tl-sm bg-muted/70 text-foreground"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                    <Bot className="h-3 w-3 text-emerald-500" />
                  </div>
                )}
                <div className="whitespace-pre-line text-sm prose">
                  <Markdown>{message.content}</Markdown>
                </div>
                <div className="mt-1 text-right text-xs text-foreground/40">
                  {formatTimestamp(message.timestamp as number)}
                </div>
              </div>
            </motion.div>
          ))}

          {/* AI Typing Indicator */}
          {isPending && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="relative max-w-[80%] rounded-2xl rounded-tl-sm bg-muted/70 px-4 py-3 text-foreground">
                <div className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                  <Bot className="h-3 w-3 text-emerald-500" />
                </div>
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-foreground/60" />
                  <span className="text-sm text-foreground/60">
                    Sleep Coach is typing...
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Suggested Questions */}
          {/* <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="mt-6"
          >
            <p className="mb-2 text-sm text-foreground/60">
              Suggested questions:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-foreground/10 bg-muted/50 text-xs hover:bg-muted/70"
                  onClick={() => handleSendMessage(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </motion.div> */}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 border-t border-foreground/10 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-3xl p-4">
          <div className="flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask Sleep Coach a question..."
              className="flex-1 border-foreground/10 bg-muted/50 placeholder:text-foreground/40"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isPending}
              className="rounded-full bg-primary hover:bg-primary/90"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-foreground/40">
            Sleep Coach AI provides personalized insights based on your sleep
            data
          </p>
        </div>
      </div>
    </div>
  );
}
