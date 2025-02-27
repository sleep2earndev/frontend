import { XCircle, AlertCircle } from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useSleep } from "@/hooks/sleep-provider"
import { useNavigate } from "react-router"
import useLeaveConfirmation from "@/hooks/use-leave-confirmation"

export default function FailedScreen() {
    const navigate = useNavigate()
    const { clearData, setStep } = useSleep()

    useLeaveConfirmation({
        isBlocked: true
    })

    function handleTryAgain() {
        navigate('/play/sleep', { replace: true })
        setStep('choose-category')
        clearData()
    }


    function handleBackToHome() {
        navigate('/play', { replace: true })
        setStep('choose-category')
        clearData()
    }
    return (
        <div className="flex flex-1 flex-col items-center justify-center bg-[#061029] bg-gradient-to-b from-background to-background/95 p-4 text-white">
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
                        className="mb-4 rounded-full bg-red-500/20 p-4"
                    >
                        <XCircle className="h-12 w-12 text-red-500" />
                    </motion.div>
                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="mb-2 text-3xl font-bold"
                    >
                        Claim Failed
                    </motion.h1>
                    <motion.p
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="text-white/70"
                    >
                        No sleep data found to claim rewards
                    </motion.p>
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <Card className="mb-6 overflow-hidden border-0 bg-white/5 text-white shadow-lg">
                        <CardContent className="relative p-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent" />
                            <div className="relative space-y-4">
                                <div className="flex items-start gap-3 rounded-lg bg-white/5 p-4">
                                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                                    <div className="space-y-1">
                                        <p className="font-medium">Unable to Process Claim</p>
                                        <p className="text-sm text-white/70">
                                            We couldn't find any valid sleep data for the current period. Make sure you:
                                        </p>
                                        <ul className="list-inside list-disc space-y-1 text-sm text-white/70">
                                            <li>Have completed a sleep session</li>
                                            <li>Haven't already claimed the rewards</li>
                                            <li>Have valid sleep data recorded</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 rounded-lg bg-white/5 p-4">
                                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-500" />
                                    <div className="space-y-1">
                                        <p className="font-medium">What to Do Next</p>
                                        <p className="text-sm text-white/70">
                                            Try starting a new sleep session or contact support if you believe this is an error.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="grid gap-4"
                >
                    <Button className="w-full bg-red-500 py-6 text-base font-medium transition-all hover:bg-red-600" onClick={handleTryAgain}>
                        Try Again
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full border-white/10 bg-white/5 py-6 text-base font-medium text-white hover:bg-white/10"
                        onClick={handleBackToHome}
                    >
                        Back to Home
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    )
}

