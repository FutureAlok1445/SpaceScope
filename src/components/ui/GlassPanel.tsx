import { cn } from "@/lib/utils";
import { ReactNode, HTMLAttributes } from "react";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

export function GlassPanel({ children, className, ...props }: GlassPanelProps) {
    return (
        <div
            className={cn(
                "backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl shadow-2xl overflow-hidden relative",
                "hover:border-white/20 transition-colors duration-300",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="relative z-10">{children}</div>
        </div>
    );
}
