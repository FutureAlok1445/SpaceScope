"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
    value?: number | number[];
    onValueChange?: (value: number | number[]) => void;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, value, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
        const numValue = Array.isArray(value) ? value[0] : value ?? min;
        
        return (
            <input
                type="range"
                className={cn(
                    "w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan hover:accent-cyan/80 transition-all",
                    "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:cursor-pointer",
                    "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer",
                    className
                )}
                ref={ref}
                value={numValue}
                min={min}
                max={max}
                step={step}
                onChange={(e) => {
                    const newValue = Number(e.target.value);
                    onValueChange?.(Array.isArray(value) ? [newValue] : newValue);
                }}
                {...props}
            />
        )
    }
)
Slider.displayName = "Slider"

export { Slider }
