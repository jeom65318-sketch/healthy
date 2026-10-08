import React, { useState } from 'react';
import { HealthProvider } from './context/HealthContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { ActivityScreen } from './screens/ActivityScreen';
import { SleepScreen } from './screens/SleepScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AICoachModal } from './components/AICoachModal';
import { LogDataModal } from './components/LogDataModal';
import { ScreenId, TransitionType } from './types';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [transition, setTransition] = useState<TransitionType>('none');
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);
  const [logModalState, setLogModalState] = useState<{ isOpen: boolean; tab?: 'steps' | 'water' | 'sleep' | 'goal' }>({
    isOpen: false,
  });

  const navigateTo = (targetScreen: ScreenId, transitionType: TransitionType = 'none') => {
    setTransition(transitionType);
    setCurrentScreen(targetScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLogModal = (tab?: 'steps' | 'water' | 'sleep' | 'goal') => {
    setLogModalState({ isOpen: true, tab });
  };

  // Animation class helper for screen transitions
  const getAnimationClass = () => {
    if (transition === 'push') {
      return 'animate-in slide-in-from-right duration-300 ease-out';
    }
    if (transition === 'push_back') {
      return 'animate-in slide-in-from-left duration-300 ease-out';
    }
    return 'animate-in fade-in duration-150';
  };

  return (
    <div className="min-h-screen bg-[#0f131d] text-[#dfe2f1] font-sans antialiased flex flex-col selection:bg-[#10b981]/30 selection:text-[#4edea3]">
      {/* Top Header */}
      <Header
        currentScreen={currentScreen}
        navigateTo={navigateTo}
        onOpenAICoach={() => setIsAICoachOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-3 pb-20 overflow-x-hidden">
        <div key={`${currentScreen}-${transition}`} className={getAnimationClass()}>
          {currentScreen === 'home' && (
            <HomeScreen
              navigateTo={navigateTo}
              onOpenLogModal={handleOpenLogModal}
              onOpenAICoach={() => setIsAICoachOpen(true)}
            />
          )}

          {currentScreen === 'activity' && (
            <ActivityScreen
              navigateTo={navigateTo}
              onOpenLogModal={handleOpenLogModal}
            />
          )}

          {currentScreen === 'sleep' && (
            <SleepScreen
              navigateTo={navigateTo}
              onOpenLogModal={handleOpenLogModal}
              onOpenAICoach={() => setIsAICoachOpen(true)}
            />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen
              navigateTo={navigateTo}
              onOpenLogModal={handleOpenLogModal}
            />
          )}
        </div>
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav currentScreen={currentScreen} navigateTo={navigateTo} />

      {/* Modals */}
      <AICoachModal isOpen={isAICoachOpen} onClose={() => setIsAICoachOpen(false)} />
      <LogDataModal
        isOpen={logModalState.isOpen}
        initialTab={logModalState.tab || 'steps'}
        onClose={() => setLogModalState({ isOpen: false })}
      />
    </div>
  );
}

export default function App() {
  return (
    <HealthProvider>
      <AppContent />
    </HealthProvider>
  );
}
