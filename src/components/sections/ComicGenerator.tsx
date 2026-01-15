"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Sparkles, Download } from "lucide-react";

export function ComicGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [comicPanels, setComicPanels] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    // Simulated generation (replace with actual StableDiffusion XL + ControlNet API)
    setTimeout(() => {
      const mockPanels = Array.from({ length: 9 }, (_, i) => {
        return `https://via.placeholder.com/400x600/1a1a2e/00ffff?text=Panel+${i + 1}`;
      });

      setComicPanels(mockPanels);
      setIsGenerating(false);

      // Page-turn sfx using Web Audio API (more reliable)
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = "sine";
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      } catch (error) {
        // Silently fail if audio is not supported
        console.debug("Audio playback not available");
      }
    }, 3000);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <GlassPanel className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-cyan-500" />
            <h2 className="font-orbitron text-2xl text-white uppercase tracking-widest">
              Cosmic Comic Generator
            </h2>
          </div>
          <p className="text-white/60 text-sm font-mono">
            Generate a 9-panel space adventure comic using AI
          </p>
        </div>

        {/* Input */}
        <div className="p-6 border-b border-white/10">
          <div className="flex gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your space adventure..."
              className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="px-6 py-3 bg-cyan-500/20 border border-cyan-500/50 rounded-lg text-cyan-500 hover:bg-cyan-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono uppercase tracking-widest"
            >
              {isGenerating ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        {/* Comic Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {comicPanels.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {comicPanels.map((panel, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={panel}
                    alt={`Comic panel ${idx + 1}`}
                    className="w-full h-auto rounded-lg border border-white/10"
                  />
                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = panel;
                      link.download = `comic-panel-${idx + 1}.png`;
                      link.click();
                    }}
                    className="absolute top-2 right-2 p-2 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Download panel"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-white/40 font-mono">
              {isGenerating
                ? "Generating your cosmic adventure..."
                : "Enter a prompt to generate your comic"}
            </div>
          )}
        </div>
      </GlassPanel>
    </div>
  );
}

