
import { useState } from "react"
import { Award, Clock, Moon, Sun, Zap } from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SLEEP_DATA, useSleep } from "@/hooks/sleep-provider"
import { useNavigate } from "react-router"
import FadeWrapper from "@/components/animation/fade"
import useLeaveConfirmation from "@/hooks/use-leave-confirmation"
import useCurrency from "@/hooks/useCurrency"

export default function SuccessClaim() {
    const navigate = useNavigate()
    const { data, clearData, setStep } = useSleep()
    const [isAnimating, setIsAnimating] = useState(true)

    const { fromWeiToEth } = useCurrency()

    useLeaveConfirmation({
        isBlocked: true
    })

    // Format duration to hours and minutes
    const hours = Math.floor(data.duration / 3600000) // Konversi ke jam
    const minutes = Math.floor((data.duration % 3600000) / 60000) // Sisa menit
    const formattedDuration = `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`

    // Get the appropriate icon based on sleep type
    const getSleepIcon = () => {
        switch (data.category) {
            case "night-sleep":
                return <Moon className="h-6 w-6 text-primary" />
            case "power-nap":
                return <Zap className="h-6 w-6 text-yellow-500" />
            case "day-nap":
                return <Sun className="h-6 w-6 text-orange-500" />
            default:
                return <Moon className="h-6 w-6 text-primary" />
        }
    }

    function backToHomepage() {
        navigate('/play', { replace: true })
        setStep('choose-category')
        clearData()
    }

    const formatETHForUI = (value: number) => {
        const _value = fromWeiToEth(value)
        return _value < 0.00000001
            ? "< 0.00000001" // Batas bawah tampilan UI
            : _value.toFixed(10);
    };

    return (
        <FadeWrapper className="flex flex-col flex-1 items-center justify-center bg-[#061029] bg-gradient-to-b from-background to-background/95 p-4 text-white">
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
                                    <h2 className="text-lg font-medium text-white/70">Total Earned</h2>
                                    <div className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">ETH</div>
                                </div>
                                <div className="mb-4 flex items-center justify-center">
                                    <div className="flex flex-col items-center">
                                        <motion.span
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.8, duration: 0.5 }}
                                            className="text-4xl font-bold"
                                        >
                                            {formatETHForUI(data?.earning)}
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
                                            setTimeout(() => setIsAnimating(false), 5000)
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
                                        className="h-full bg-gradient-to-r from-primary to-primary/80"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="space-y-4"
                >
                    <div className="relative overflow-hidden rounded-xl bg-white/5 p-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center">
                                <Clock className="mr-3 h-5 w-5 text-primary" />
                                <span className="text-white/70">Total Duration</span>
                            </div>
                            <span className="font-medium">{formattedDuration}</span>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl bg-white/5 p-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center">
                                {getSleepIcon()}
                                <span className="ml-3 text-white/70">Sleep Type</span>
                            </div>
                            <span className="font-medium capitalize">{SLEEP_DATA[data.category as keyof typeof SLEEP_DATA]}</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="mt-8"
                >
                    <Button className="group relative w-full overflow-hidden bg-primary py-6 text-base font-medium transition-all hover:bg-primary/90" onClick={backToHomepage}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                        Back to Home
                    </Button>
                </motion.div>
            </motion.div>
        </FadeWrapper>
    )
}

