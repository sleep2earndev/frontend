"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Swipe({children, ...props}: {children: React.ReactNode, [k: string]: any}) {
    const [sliding, setSliding] = useState(false)
    const [progress, setProgress] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const sliderRef = useRef<HTMLDivElement>(null)
    const startXRef = useRef(0)
    const currentXRef = useRef(0)

    const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
        setSliding(true)
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
        startXRef.current = clientX - (currentXRef.current || 0)
    }

    const handleTouchMove = useCallback(
        (e: TouchEvent | MouseEvent) => {
            if (!sliding) return

            const clientX = "touches" in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX
            const containerWidth = containerRef.current?.offsetWidth ?? 0
            const sliderWidth = sliderRef.current?.offsetWidth ?? 0
            const maxTravel = containerWidth - sliderWidth

            let travel = clientX - startXRef.current
            travel = Math.max(0, Math.min(travel, maxTravel))

            currentXRef.current = travel
            setProgress((travel / maxTravel) * 100)

            if (sliderRef.current) {
                sliderRef.current.style.transform = `translateX(${travel -10}px)`
            }

            if (progress >= 95) {
                handleSuccess()
            }
        },
        [sliding, progress],
    )

    const handleTouchEnd = useCallback(() => {
        if (!sliding) return
        setSliding(false)

        if (progress < 95) {
            // Reset position with animation
            if (sliderRef.current) {
                sliderRef.current.style.transform = "translateX(0px)"
                currentXRef.current = 0
                setProgress(0)
            }
        }
    }, [progress, sliding])

    const handleSuccess = () => {
        // Add your unlock action here
        console.log("Unlocked!")
    }

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => handleTouchMove(e)
        const handleMouseUp = () => handleTouchEnd()

        if (sliding) {
            window.addEventListener("mousemove", handleMouseMove)
            window.addEventListener("mouseup", handleMouseUp)
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [sliding, handleTouchMove, handleTouchEnd])

    return (
        <div ref={containerRef} className={cn("max-w-md bg-white rounded-md relative overflow-hidden", props.className)}>
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
            <div className="py-4 px-6 text-center text-gray-600 font-medium">{children}</div>
        </div>
    )
}

