import React from 'react';
import { Home, Activity, Moon, User } from 'lucide-react';
import { ScreenId, TransitionType } from '../types';

interface BottomNavProps {
  currentScreen: ScreenId;
  navigateTo: (screen: ScreenId, transition?: TransitionType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, navigateTo }) => {
  return (
    <nav className="glass-nav fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16 max-w-md mx-auto px-2">
      <a
        data-path="home"
        href="#home"
        onClick={(e) => {
          e.preventDefault();
          navigateTo('home', 'none');
        }}
        className={`flex flex-col items-center justify-center w-full h-full text-[11px] font-medium transition-all ${
          currentScreen === 'home'
            ? 'text-[#10b981] font-semibold'
            : 'text-[#86948a] hover:text-[#dfe2f1]'
        }`}
      >
        <Home className={`w-5 h-5 mb-0.5 transition-transform ${currentScreen === 'home' ? 'scale-110' : ''}`} />
        <span>홈</span>
      </a>

      <a
        data-path="activity"
        href="#activity"
        onClick={(e) => {
          e.preventDefault();
          navigateTo('activity', 'none');
        }}
        className={`flex flex-col items-center justify-center w-full h-full text-[11px] font-medium transition-all ${
          currentScreen === 'activity'
            ? 'text-[#10b981] font-semibold'
            : 'text-[#86948a] hover:text-[#dfe2f1]'
        }`}
      >
        <Activity className={`w-5 h-5 mb-0.5 transition-transform ${currentScreen === 'activity' ? 'scale-110' : ''}`} />
        <span>활동 분석</span>
      </a>

      <a
        data-path="sleep"
        href="#sleep"
        onClick={(e) => {
          e.preventDefault();
          navigateTo('sleep', 'none');
        }}
        className={`flex flex-col items-center justify-center w-full h-full text-[11px] font-medium transition-all ${
          currentScreen === 'sleep'
            ? 'text-[#6366f1] font-semibold'
            : 'text-[#86948a] hover:text-[#dfe2f1]'
        }`}
      >
        <Moon className={`w-5 h-5 mb-0.5 transition-transform ${currentScreen === 'sleep' ? 'scale-110' : ''}`} />
        <span>수면 리포트</span>
      </a>

      <a
        data-path="profile"
        href="#profile"
        onClick={(e) => {
          e.preventDefault();
          navigateTo('profile', 'none');
        }}
        className={`flex flex-col items-center justify-center w-full h-full text-[11px] font-medium transition-all ${
          currentScreen === 'profile'
            ? 'text-[#ffb690] font-semibold'
            : 'text-[#86948a] hover:text-[#dfe2f1]'
        }`}
      >
        <User className={`w-5 h-5 mb-0.5 transition-transform ${currentScreen === 'profile' ? 'scale-110' : ''}`} />
        <span>내 프로필</span>
      </a>
    </nav>
  );
};
