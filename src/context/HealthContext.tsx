import React, { createContext, useContext, useState, useEffect } from 'react';
import { HealthState, UserProfile, WorkoutRecord } from '../types';

const INITIAL_HOURLY_DATA = [
  { hour: '06:00', steps: 120, calories: 12 },
  { hour: '08:00', steps: 1450, calories: 95 },
  { hour: '10:00', steps: 2100, calories: 140 },
  { hour: '12:00', steps: 1800, calories: 110 },
  { hour: '14:00', steps: 1250, calories: 85 },
  { hour: '16:00', steps: 950, calories: 60 },
  { hour: '18:00', steps: 750, calories: 38 },
];

const INITIAL_SLEEP_STAGES = [
  { time: '23:20', stage: 'awake', durationMinutes: 15 },
  { time: '23:35', stage: 'light', durationMinutes: 45 },
  { time: '00:20', stage: 'deep', durationMinutes: 110 },
  { time: '02:10', stage: 'rem', durationMinutes: 80 },
  { time: '03:30', stage: 'light', durationMinutes: 90 },
  { time: '05:00', stage: 'deep', durationMinutes: 50 },
  { time: '05:50', stage: 'rem', durationMinutes: 50 },
  { time: '06:40', stage: 'light', durationMinutes: 25 },
] as const;

const INITIAL_WORKOUTS: WorkoutRecord[] = [
  {
    id: 'w-1',
    type: 'running',
    title: '야간 인터벌 러닝',
    durationMinutes: 35,
    caloriesBurned: 310,
    distanceKm: 5.2,
    date: '어제 20:15',
    icon: 'Flame',
  },
  {
    id: 'w-2',
    type: 'cycling',
    title: '한강 라이딩',
    durationMinutes: 48,
    caloriesBurned: 240,
    distanceKm: 12.4,
    date: '3일 전',
    icon: 'Bike',
  },
];

const INITIAL_USER_PROFILE: UserProfile = {
  name: '김민준',
  email: 'minjun.kim@vitalpulse.io',
  age: 29,
  heightCm: 178,
  weightKg: 72.4,
  targetWeightKg: 70.0,
  stepGoal: 10000,
  calorieGoal: 650,
  sleepGoalHours: 8.0,
  deviceConnected: true,
  deviceName: 'VitalPulse Watch Pro',
  lastSynced: '방금 전',
};

const DEFAULT_STATE: HealthState = {
  steps: 8420,
  stepGoal: 10000,
  calories: 540,
  calorieGoal: 650,
  sleepHours: 7.75,
  sleepGoalHours: 8.0,
  sleepScore: 88,
  waterMl: 1500,
  waterGoalMl: 2000,
  currentHeartRate: 72,
  activeWorkout: {
    isRunning: true,
    type: 'running',
    title: '실외 야간 러닝',
    elapsedSeconds: 1420, // ~23 mins
    caloriesBurned: 215,
    distanceKm: 3.4,
  },
  hourlyData: INITIAL_HOURLY_DATA,
  sleepStages: [...INITIAL_SLEEP_STAGES],
  workoutHistory: INITIAL_WORKOUTS,
  userProfile: INITIAL_USER_PROFILE,
};

interface HealthContextType {
  healthState: HealthState;
  addSteps: (count: number) => void;
  addWater: (ml: number) => void;
  updateStepGoal: (goal: number) => void;
  startWorkout: (type: 'running' | 'cycling' | 'fitness' | 'swimming' | 'yoga' | 'walking', title: string) => void;
  pauseResumeWorkout: () => void;
  stopWorkout: () => void;
  logSleepData: (hours: number, score: number) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  resetToDefaults: () => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [healthState, setHealthState] = useState<HealthState>(() => {
    const saved = localStorage.getItem('vitalpulse_health_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved health state:', e);
      }
    }
    return DEFAULT_STATE;
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('vitalpulse_health_state', JSON.stringify(healthState));
  }, [healthState]);

  // Dynamic heart rate flutter simulation & active workout ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthState((prev) => {
        // Heart rate variation: around 68-76 (or 120-140 if workout is running)
        const isWorkout = prev.activeWorkout?.isRunning;
        const targetBpm = isWorkout ? 132 : 72;
        const hrDelta = Math.floor(Math.random() * 5) - 2;
        const newBpm = Math.min(Math.max(targetBpm + hrDelta, isWorkout ? 110 : 60), isWorkout ? 165 : 95);

        let updatedWorkout = prev.activeWorkout;
        let addedSteps = 0;
        let addedCalories = 0;

        if (prev.activeWorkout && prev.activeWorkout.isRunning) {
          const newElapsed = prev.activeWorkout.elapsedSeconds + 1;
          const newDist = parseFloat((prev.activeWorkout.distanceKm + 0.0025).toFixed(2));
          const newCals = prev.activeWorkout.caloriesBurned + 0.15;
          addedSteps = Math.random() > 0.4 ? 2 : 0;
          addedCalories = 0.15;

          updatedWorkout = {
            ...prev.activeWorkout,
            elapsedSeconds: newElapsed,
            distanceKm: newDist,
            caloriesBurned: Math.round(newCals * 10) / 10,
          };
        }

        return {
          ...prev,
          currentHeartRate: newBpm,
          steps: prev.steps + addedSteps,
          calories: Math.round((prev.calories + addedCalories) * 10) / 10,
          activeWorkout: updatedWorkout,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addSteps = (count: number) => {
    setHealthState((prev) => {
      const newSteps = prev.steps + count;
      const addedCals = Math.round((count * 0.04) * 10) / 10;
      return {
        ...prev,
        steps: newSteps,
        calories: Math.round((prev.calories + addedCals) * 10) / 10,
      };
    });
  };

  const addWater = (ml: number) => {
    setHealthState((prev) => ({
      ...prev,
      waterMl: Math.min(prev.waterMl + ml, 4000),
    }));
  };

  const updateStepGoal = (goal: number) => {
    setHealthState((prev) => ({
      ...prev,
      stepGoal: goal,
      userProfile: {
        ...prev.userProfile,
        stepGoal: goal,
      },
    }));
  };

  const startWorkout = (type: HealthState['activeWorkout'] extends null ? never : NonNullable<HealthState['activeWorkout']>['type'], title: string) => {
    setHealthState((prev) => ({
      ...prev,
      activeWorkout: {
        isRunning: true,
        type,
        title,
        elapsedSeconds: 0,
        caloriesBurned: 0,
        distanceKm: 0,
      },
    }));
  };

  const pauseResumeWorkout = () => {
    setHealthState((prev) => {
      if (!prev.activeWorkout) return prev;
      return {
        ...prev,
        activeWorkout: {
          ...prev.activeWorkout,
          isRunning: !prev.activeWorkout.isRunning,
        },
      };
    });
  };

  const stopWorkout = () => {
    setHealthState((prev) => {
      if (!prev.activeWorkout) return prev;

      const finishedRecord: WorkoutRecord = {
        id: `w-${Date.now()}`,
        type: prev.activeWorkout.type,
        title: prev.activeWorkout.title,
        durationMinutes: Math.max(1, Math.floor(prev.activeWorkout.elapsedSeconds / 60)),
        caloriesBurned: Math.round(prev.activeWorkout.caloriesBurned),
        distanceKm: prev.activeWorkout.distanceKm,
        date: '방금 전 완료',
        icon: 'Flame',
      };

      return {
        ...prev,
        activeWorkout: null,
        workoutHistory: [finishedRecord, ...prev.workoutHistory],
      };
    });
  };

  const logSleepData = (hours: number, score: number) => {
    setHealthState((prev) => ({
      ...prev,
      sleepHours: hours,
      sleepScore: score,
    }));
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setHealthState((prev) => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        ...profile,
      },
    }));
  };

  const resetToDefaults = () => {
    setHealthState(DEFAULT_STATE);
    localStorage.removeItem('vitalpulse_health_state');
  };

  return (
    <HealthContext.Provider
      value={{
        healthState,
        addSteps,
        addWater,
        updateStepGoal,
        startWorkout,
        pauseResumeWorkout,
        stopWorkout,
        logSleepData,
        updateUserProfile,
        resetToDefaults,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
