import IconPowerNap from "@/components/icon/power-nap";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Moon,
  Sun,
  Wallet,
  Trophy,
  BarChart,
  ArrowRight,
  Users,
} from "lucide-react";
import { NavLink } from "react-router";

import { motion } from "motion/react";
import FadeWrapper from "@/components/animation/fade";
import { cn } from "@/lib/utils";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";

export default function LandingPage() {
  function login() {
    window.location.href = `${import.meta.env.VITE_API_URL}/user/auth/fitbit`;
  }
  return (
    <FadeWrapper className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <header className="relative flex flex-col items-center justify-center overflow-hidden bg-background px-4 py-16 text-center md:px-6 md:py-24 lg:py-32 min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-black to-background/20 opacity-90" />
        <InteractiveGridPattern
          className={cn(
            "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
          )}
          width={80}
          height={80}
          squares={[160, 160]}
          squaresClassName="hover:fill-blue-500"
        />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 mx-auto max-w-5xl space-y-8"
        >
          <div className="inline-block">
            <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
              <span
                className={cn(
                  "absolute inset-0 block h-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]",
                )}
                style={{
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "destination-out",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "subtract",
                  WebkitClipPath: "padding-box",
                }}
              />
              🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
              <AnimatedGradientText className="text-sm font-medium">
                Web3 Sleep-to-Earn Platform
              </AnimatedGradientText>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Sleep2Earn: Get Rewarded for a Good Night's Rest!
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-gray-300 md:text-xl">
            Sleep better, earn more. A Web3-powered Sleep-to-Earn platform.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-primary text-white hover:bg-primary/90"
              onClick={login}
            >
              Join Now
            </Button>
          </div>
        </motion.div>
      </header>

      {/* How It Works */}
      <section className="bg-background px-4 py-16 md:px-6 md:py-24 lg:py-32">
        <div className="container">
          <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-center text-gray-500 md:text-lg">
            Earn tokens while you sleep. It's that simple.
          </p>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col items-center p-6 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Moon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Night Sleep</h3>
              <p className="mt-2 text-gray-500">
                8 hours of restful sleep for maximum earnings
              </p>
            </Card>
            <Card className="flex flex-col items-center p-6 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Sun className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Day Nap</h3>
              <p className="mt-2 text-gray-500">
                Perfect for afternoon recharge and bonus tokens
              </p>
            </Card>
            <Card className="flex flex-col items-center p-6 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <IconPowerNap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Power Nap</h3>
              <p className="mt-2 text-gray-500">
                Quick 20-minute naps for instant rewards
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Token & Economy */}
      <section className="bg-background px-4 py-16 text-white md:px-6 md:py-24 lg:py-32">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Token Economy
              </h2>
              <p className="text-gray-400 md:text-lg">
                Our tokenomics are designed to reward consistent sleep habits
                and create a sustainable economy.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/20 p-2">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Easy Transactions</h3>
                    <p className="text-sm text-gray-400">
                      Seamless top-up and withdrawal system
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-[#F59D0B]/20 p-2">
                    <BarChart className="h-6 w-6 text-[#F59D0B]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Dynamic Rewards</h3>
                    <p className="text-sm text-gray-400">
                      Earn more with consistent sleep patterns
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] overflow-hidden rounded-lg lg:h-[550px]">
              <img
                src="/leaderboard.gif"
                alt="Token Economics"
                className="object-cover mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Competition & Stats */}
      <section className="bg-background px-4 py-16 md:px-6 md:py-24 lg:py-32">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold tracking-tighter  sm:text-4xl">
                Compete & Earn
              </h2>
              <p className="text-gray-500 md:text-lg">
                Join sleep competitions and climb the leaderboard for extra
                rewards.
              </p>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Trophy className="h-8 w-8 text-[#F59D0B]" />
                    <div>
                      <h3 className="font-semibold text-[#F59D0B]">
                        Global Leaderboard
                      </h3>
                      <p className="text-sm text-gray-500">
                        Updated in real-time
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-primary"
                    onClick={login}
                  >
                    It's your time! <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold">Total Users</h3>
                <p className="mt-2 text-3xl font-bold text-primary">50K+</p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Users className="mr-2 h-4 w-4" />
                  Growing community
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold">Total Rewards</h3>
                <p className="mt-2 text-3xl font-bold text-[#F59D0B]">1M+</p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Wallet className="mr-2 h-4 w-4" />
                  Tokens distributed
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background px-4 py-16 md:px-6 md:py-24 lg:py-32">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br bg-primary p-8 md:p-12 lg:p-16">
            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                Start Earning While You Sleep
              </h2>
              <p className="mx-auto mt-4 max-w-[600px] text-lg text-white/90">
                Join thousands of users who are already earning rewards for
                their sleep habits.
              </p>
              <Button
                size="lg"
                className="mt-8 bg-white text-primary hover:bg-white/90"
                onClick={login}
              >
                Get Started Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background px-4 py-12 md:px-6">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-sm text-gray-500">
              © 2025 Sleep2Earn. All rights reserved.
            </p>
            <div className="flex gap-6">
              <NavLink
                to="#"
                className="text-sm text-gray-500 hover:text-primary"
              >
                Terms
              </NavLink>
              <NavLink
                to="#"
                className="text-sm text-gray-500 hover:text-primary"
              >
                Privacy
              </NavLink>
              <NavLink
                to="#"
                className="text-sm text-gray-500 hover:text-primary"
              >
                Contact
              </NavLink>
            </div>
          </div>
        </div>
      </footer>
    </FadeWrapper>
  );
}
