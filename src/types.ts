export type ScreenId = 'home' | 'activity' | 'sleep' | 'profile';

export type TransitionType = 'none' | 'push' | 'push_back';

export interface SleepStage {
  time: string; // e.g. "23:30"
  stage: 'awake' | 'rem' | 'light' | 'deep';
  durationMinutes: number;
}

export interface HourlyActivity {
  hour: string; // e.g. "08:00"
  steps: number;
  calories: number;
}

export interface WorkoutRecord {
  id: string;
  type: 'running' | 'cycling' | 'fitness' | 'swimming' | 'yoga' | 'walking';
  title: string;
  durationMinutes: number;
  caloriesBurned: number;
  distanceKm?: number;
  date: string;
  icon: string;
}

export interface UserProfile {
  name: string;
  email: string;
  age: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  stepGoal: number;
  calorieGoal: number;
  sleepGoalHours: number;
  deviceConnected: boolean;
  deviceName: string;
  lastSynced: string;
}

export interface HealthState {
  steps: number;
  stepGoal: number;
  calories: number;
  calorieGoal: number;
  sleepHours: number;
  sleepGoalHours: number;
  sleepScore: number;
  waterMl: number;
  waterGoalMl: number;
  currentHeartRate: number;
  activeWorkout: {
    isRunning: boolean;
    type: 'running' | 'cycling' | 'fitness' | 'swimming' | 'yoga' | 'walking';
    title: string;
    elapsedSeconds: number;
    caloriesBurned: number;
    distanceKm: number;
  } | null;
  hourlyData: HourlyActivity[];
  sleepStages: SleepStage[];
  workoutHistory: WorkoutRecord[];
  userProfile: UserProfile;
}
