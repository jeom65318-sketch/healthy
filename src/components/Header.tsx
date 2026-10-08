import React from 'react';
import { User, Sparkles } from 'lucide-react';
import { ScreenId, TransitionType } from '../types';
import { useHealth } from '../context/HealthContext';

interface HeaderProps {
  currentScreen: ScreenId;
  navigateTo: (screen: ScreenId, transition?: TransitionType) => void;
  onOpenAICoach: () => void;
}

export const Header: React.FC<HeaderProps> = ({ navigateTo, onOpenAICoach }) => {
  const { healthState } = useHealth();
  const { userProfile } = healthState;

  return (
    <header className="glass-header sticky top-0 z-40 flex items-center justify-between px-4 py-3 max-w-md mx-auto w-full">
      {/* Zone 1: Wordmark & Live Telemetry Dot */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-[#10b981] via-[#059669] to-[#6366f1] text-white font-bold text-xs shadow-md shadow-[#10b981]/20">
          <span>VP</span>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping opacity-75" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#10b981]" />
        </div>
        <div className="flex flex-col">
          <span className="font-sora font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-[#10b981] bg-clip-text text-transparent">
            VitalPulse
          </span>
          <span className="text-[10px] text-emerald-400/90 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            실시간 바이탈 동기화
          </span>
        </div>
      </div>

      {/* Zone 2: Action Buttons (AI Assistant + Header Profile Button) */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenAICoach}
          className="px-2.5 py-1.5 rounded-xl bg-[#6366f1]/15 border border-[#6366f1]/30 text-[#c0c1ff] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#6366f1]/25 transition-all active:scale-95 glow-indigo"
          title="AI 수석 코치 피드백"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#c0c1ff] animate-pulse" />
          <span className="hidden sm:inline">AI 코치</span>
        </button>

        {/* Mandatory Header Profile Button: //header//button[@aria-label='Profile'] */}
        <button
          aria-label="Profile"
          onClick={() => navigateTo('profile', 'push')}
          className="w-9 h-9 rounded-full bg-[#171b26] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#10b981]/50 transition-all active:scale-95 shadow-inner"
        >
          <User className="w-4 h-4 text-emerald-400" />
        </button>
      </div>
    </header>
  );
};
