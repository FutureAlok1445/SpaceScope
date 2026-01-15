import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ScrollProvider } from "@/components/ScrollProvider";
import VideoBackground from "@/components/ui/VideoBackground";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SpaceScope | Explore, Learn & Stay Connected with the Universe",
  description: "Interactive platform for real-time space information, celestial events, cosmic weather, and space education.",
  keywords: ["space", "astronomy", "ISS tracking", "aurora forecast", "space missions", "NASA", "NOAA"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(orbitron.variable, inter.variable, "dark")} suppressHydrationWarning>
      <body className="font-inter antialiased bg-transparent text-foreground" suppressHydrationWarning>
        {/* Full-screen looping video background with audio */}
        <VideoBackground />
        <ScrollProvider>
          {children}
        </ScrollProvider>
      </body>
    </html>
  );
}

