import React from 'react';
import { Footprints, Flame, Moon, Heart, Play, Plus, Droplets, Sparkles, ChevronRight, Zap, Trophy } from 'lucide-react';
import { ScreenId, TransitionType } from '../types';
import { useHealth } from '../context/HealthContext';

interface HomeScreenProps {
  navigateTo: (screen: ScreenId, transition?: TransitionType) => void;
  onOpenLogModal: (tab?: 'steps' | 'water' | 'sleep' | 'goal') => void;
  onOpenAICoach: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigateTo, onOpenLogModal, onOpenAICoach }) => {
  const { healthState, addSteps, addWater } = useHealth();
  const { steps, stepGoal, calories, calorieGoal, sleepHours, sleepScore, currentHeartRate, waterMl, waterGoalMl, activeWorkout } = healthState;

  const stepPercent = Math.min(100, Math.round((steps / stepGoal) * 100));
  const caloriePercent = Math.min(100, Math.round((calories / calorieGoal) * 100));
  const sleepPercent = Math.min(100, Math.round((sleepHours / healthState.sleepGoalHours) * 100));

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      {/* Concentric Biometric Hero Scorecard */}
      <div className="glass-card rounded-3xl p-5 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10b981]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#6366f1]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">오늘의 바이탈 리포트</span>
            <h2 className="font-sora font-extrabold text-xl text-white mt-0.5">실시간 바이탈 펄스</h2>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#4edea3] text-[11px] font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
            <span>정상 수치 유지 중</span>
          </div>
        </div>

        {/* Biometric Ring Gauge Section */}
        <div className="flex items-center justify-around py-2">
          {/* Concentric Ring SVG */}
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Steps Ring Outer */}
              <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#10b981"
                strokeWidth="8"
                strokeDasharray="263.89"
                strokeDashoffset={263.89 - (263.89 * stepPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />

              {/* Calories Ring Middle */}
              <circle cx="50" cy="50" r="32" stroke="rgba(255,255,255,0.06)" strokeWidth="7" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="32"
                stroke="#f97316"
                strokeWidth="7"
                strokeDasharray="201.06"
                strokeDashoffset={201.06 - (201.06 * caloriePercent) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />

              {/* Sleep Ring Inner */}
              <circle cx="50" cy="50" r="23" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="23"
                stroke="#6366f1"
                strokeWidth="6"
                strokeDasharray="144.51"
                strokeDashoffset={144.51 - (144.51 * sleepPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-sora font-extrabold text-2xl text-white tabular-nums tracking-tight">
                {stepPercent}%
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">목표 달성</span>
            </div>
          </div>

          {/* Ring Legend & Stats */}
          <div className="space-y-2.5 text-xs">
            <div
              onClick={() => navigateTo('activity', 'none')}
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-3 h-3 rounded-full bg-[#10b981] glow-emerald" />
              <div>
                <div className="text-[10px] text-slate-400">걸음 수</div>
                <div className="font-sora font-bold text-slate-100 tabular-nums">
                  {steps.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">/ {stepGoal.toLocaleString()}보</span>
                </div>
              </div>
            </div>

            <div
              onClick={() => navigateTo('activity', 'none')}
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-3 h-3 rounded-full bg-[#f97316] glow-coral" />
              <div>
                <div className="text-[10px] text-slate-400">소모 칼로리</div>
                <div className="font-sora font-bold text-slate-100 tabular-nums">
                  {calories} <span className="text-[10px] text-slate-400 font-normal">/ {calorieGoal} kcal</span>
                </div>
              </div>
            </div>

            <div
              onClick={() => navigateTo('sleep', 'none')}
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-3 h-3 rounded-full bg-[#6366f1] glow-indigo" />
              <div>
                <div className="text-[10px] text-slate-400">수면 시간</div>
                <div className="font-sora font-bold text-slate-100 tabular-nums">
                  {Math.floor(sleepHours)}시간 {Math.round((sleepHours % 1) * 60)}분
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory XPath Element: //button[contains(., '이어하기')] -> Activity (push transition) */}
      <div className="glass-card rounded-3xl p-4 border border-[#10b981]/30 bg-gradient-to-r from-[#171b26] via-[#1c2430] to-[#10b981]/10 flex items-center justify-between shadow-lg glow-emerald">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center text-[#4edea3]">
            <Zap className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#10b981]/20 text-[#4edea3] font-semibold">
                {activeWorkout?.isRunning ? '세션 진행 중' : '최근 운동 세션'}
              </span>
              {activeWorkout?.isRunning && (
                <span className="text-[10px] text-slate-400 tabular-nums">
                  {Math.floor(activeWorkout.elapsedSeconds / 60)}분 {activeWorkout.elapsedSeconds % 60}초
                </span>
              )}
            </div>
            <h3 className="font-sora font-bold text-sm text-white mt-0.5">
              {activeWorkout?.title || '야간 인터벌 러닝'}
            </h3>
            <p className="text-[11px] text-slate-400">
              소모 칼로리 {activeWorkout ? activeWorkout.caloriesBurned : 215} kcal · 거리 {activeWorkout ? activeWorkout.distanceKm : 3.4} km
            </p>
          </div>
        </div>

        {/* Button with exact text "이어하기" or "운동 이어하기" */}
        <button
          onClick={() => navigateTo('activity', 'push')}
          className="px-3.5 py-2 rounded-full bg-[#10b981] hover:bg-[#6ffbbe] text-[#002113] font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>운동 이어하기</span>
        </button>
      </div>

      {/* Main Metric Grid Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: 걸음 수 (Steps) */}
        <div
          onClick={() => navigateTo('activity', 'none')}
          className="glass-card rounded-2xl p-4 border border-white/10 hover:border-[#10b981]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Footprints className="w-3.5 h-3.5 text-[#10b981]" />
              걸음 수
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="font-sora font-bold text-2xl text-white tabular-nums tracking-tight">
            {steps.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>목표 {stepGoal.toLocaleString()}보</span>
            <span className="text-emerald-400 font-semibold">{stepPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-[#10b981] rounded-full transition-all duration-500" style={{ width: `${stepPercent}%` }} />
          </div>
        </div>

        {/* Card 2: 소모 칼로리 (Calories) */}
        <div
          onClick={() => navigateTo('activity', 'none')}
          className="glass-card rounded-2xl p-4 border border-white/10 hover:border-[#f97316]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#f97316]" />
              칼로리 소모
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-400 transition-colors" />
          </div>
          <div className="font-sora font-bold text-2xl text-white tabular-nums tracking-tight">
            {calories} <span className="text-xs font-normal text-slate-400">kcal</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>활동 380 + BMR 160</span>
            <span className="text-orange-400 font-semibold">{caloriePercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-[#f97316] rounded-full transition-all duration-500" style={{ width: `${caloriePercent}%` }} />
          </div>
        </div>

        {/* Card 3: 수면 리포트 (Sleep) */}
        <div
          onClick={() => navigateTo('sleep', 'none')}
          className="glass-card rounded-2xl p-4 border border-white/10 hover:border-[#6366f1]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
              <Moon className="w-3.5 h-3.5 text-[#6366f1]" />
              수면 품질
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
          </div>
          <div className="font-sora font-bold text-2xl text-white tabular-nums tracking-tight">
            {Math.floor(sleepHours)}<span className="text-sm font-normal text-slate-400">h</span> {Math.round((sleepHours % 1) * 60)}<span className="text-sm font-normal text-slate-400">m</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>수면 점수 {sleepScore}점</span>
            <span className="text-indigo-400 font-semibold">최적 상태</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-[#6366f1] rounded-full transition-all duration-500" style={{ width: `${sleepScore}%` }} />
          </div>
        </div>

        {/* Card 4: 실시간 심박수 (Heart Rate) */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 hover:border-pink-500/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
              실시간 심박수
            </span>
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
          </div>
          <div className="font-sora font-bold text-2xl text-white tabular-nums tracking-tight flex items-baseline gap-1">
            {currentHeartRate} <span className="text-xs font-normal text-slate-400">BPM</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>안정 심박수 64 BPM</span>
            <span className="text-pink-400 font-semibold">휴식 단계</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-pink-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (currentHeartRate / 180) * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Quick Interactive Actions */}
      <div className="glass-card rounded-2xl p-3.5 border border-white/10 flex items-center justify-between gap-2">
        <button
          onClick={() => addSteps(50)}
          className="flex-1 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-[#4edea3] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+50보 걷기</span>
        </button>

        <button
          onClick={() => addWater(250)}
          className="flex-1 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <Droplets className="w-3.5 h-3.5 text-blue-400" />
          <span>+250ml 물</span>
        </button>

        <button
          onClick={onOpenAICoach}
          className="flex-1 py-2 rounded-xl bg-[#6366f1]/15 hover:bg-[#6366f1]/25 border border-[#6366f1]/30 text-[#c0c1ff] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#c0c1ff]" />
          <span>AI 코치</span>
        </button>
      </div>

      {/* Hourly Activity Sparkline */}
      <div className="glass-card rounded-2xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-sora font-bold text-xs text-white">오늘 시간대별 걸음 분포</h4>
          <span className="text-[10px] text-slate-400">최고 활동: 10:00 (2,100보)</span>
        </div>
        <div className="h-20 flex items-end justify-between gap-1.5 pt-2">
          {healthState.hourlyData.map((d, i) => {
            const hPercent = Math.min(100, Math.round((d.steps / 2500) * 100));
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full bg-slate-800 rounded-t-sm h-16 flex items-end overflow-hidden p-0.5">
                  <div
                    className="w-full bg-gradient-to-t from-[#059669] to-[#10b981] rounded-t-sm transition-all duration-500 group-hover:brightness-125"
                    style={{ height: `${hPercent}%` }}
                  />
                </div>
                <span className="text-[9px] text-slate-500 font-mono">{d.hour}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
