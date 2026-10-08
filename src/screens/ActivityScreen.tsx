import React, { useState } from 'react';
import { Activity, Flame, Footprints, Play, Pause, Square, Zap, Clock, TrendingUp, Award, Plus, ChevronRight } from 'lucide-react';
import { ScreenId, TransitionType } from '../types';
import { useHealth } from '../context/HealthContext';

interface ActivityScreenProps {
  navigateTo: (screen: ScreenId, transition?: TransitionType) => void;
  onOpenLogModal: (tab?: 'steps' | 'water' | 'sleep' | 'goal') => void;
}

export const ActivityScreen: React.FC<ActivityScreenProps> = ({ navigateTo, onOpenLogModal }) => {
  const { healthState, startWorkout, pauseResumeWorkout, stopWorkout, addSteps } = useHealth();
  const { steps, stepGoal, calories, calorieGoal, activeWorkout, workoutHistory, hourlyData } = healthState;

  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('day');
  const [selectedWorkoutType, setSelectedWorkoutType] = useState<'running' | 'cycling' | 'fitness' | 'swimming' | 'yoga' | 'walking'>('running');

  const stepPercent = Math.min(100, Math.round((steps / stepGoal) * 100));

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      {/* Timeframe Segmented Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">신체 활동 리포트</span>
          <h2 className="font-sora font-extrabold text-xl text-white">활동 분석</h2>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#111827] rounded-full border border-white/10">
          {(['day', 'week', 'month'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                timeframe === tf
                  ? 'bg-[#10b981] text-[#002113] shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf === 'day' ? '일간' : tf === 'week' ? '주간' : '월간'}
            </button>
          ))}
        </div>
      </div>

      {/* Live Active Workout Dashboard / Timer Card */}
      <div className="glass-card rounded-3xl p-5 border border-[#10b981]/30 bg-gradient-to-br from-[#111827] via-[#16222b] to-[#10b981]/15 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
            <span className="font-sora font-bold text-xs text-[#4edea3] uppercase tracking-wider">
              {activeWorkout ? (activeWorkout.isRunning ? '실시간 운동 진행 중' : '운동 일시 정지') : '새 운동 시작'}
            </span>
          </div>
          {activeWorkout && (
            <span className="text-xs font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30">
              {formatSeconds(activeWorkout.elapsedSeconds)}
            </span>
          )}
        </div>

        {activeWorkout ? (
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <h3 className="font-sora font-extrabold text-2xl text-white">{activeWorkout.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">실시간 GPS 및 심박수 모니터링 연동 중</p>
              </div>
              <div className="text-right">
                <div className="font-sora font-extrabold text-2xl text-[#f97316] tabular-nums">
                  {activeWorkout.caloriesBurned} <span className="text-xs font-normal text-slate-400">kcal</span>
                </div>
                <div className="text-xs text-slate-400">소모 칼로리</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-[#0f131d]/70 rounded-2xl p-3 border border-white/5 text-center">
              <div>
                <div className="text-[10px] text-slate-400">거리</div>
                <div className="font-sora font-bold text-base text-white tabular-nums">{activeWorkout.distanceKm} km</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">평균 페이스</div>
                <div className="font-sora font-bold text-base text-emerald-400 tabular-nums">5'24"</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">심박수</div>
                <div className="font-sora font-bold text-base text-pink-400 tabular-nums">{healthState.currentHeartRate} BPM</div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={pauseResumeWorkout}
                className="flex-1 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                {activeWorkout.isRunning ? (
                  <>
                    <Pause className="w-4 h-4 text-amber-400" />
                    <span>일시정지</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-[#10b981] fill-current" />
                    <span>운동 재개</span>
                  </>
                )}
              </button>

              <button
                onClick={stopWorkout}
                className="py-2.5 px-4 rounded-2xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>운동 완료</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="font-sora font-bold text-sm text-white">운동 종목 선택 및 시작</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'running', title: '야간 러닝' },
                { type: 'cycling', title: '야외 사이클' },
                { type: 'fitness', title: '웨이트 트레이닝' },
                { type: 'swimming', title: '실내 수영' },
                { type: 'yoga', title: '코어 요가' },
                { type: 'walking', title: '파워 워킹' },
              ].map((w) => (
                <button
                  key={w.type}
                  onClick={() => setSelectedWorkoutType(w.type as any)}
                  className={`p-2.5 rounded-2xl text-left border transition-all ${
                    selectedWorkoutType === w.type
                      ? 'bg-[#10b981]/20 border-[#10b981] text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{w.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">실시간 추적</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => startWorkout(selectedWorkoutType, `${selectedWorkoutType === 'running' ? '야간 인터벌 러닝' : selectedWorkoutType === 'cycling' ? '라이딩 세션' : '맞춤 운동'}`)}
              className="w-full py-3 rounded-2xl bg-[#10b981] hover:bg-[#6ffbbe] text-[#002113] font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 glow-emerald"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>새 운동 세션 시작</span>
            </button>
          </div>
        )}
      </div>

      {/* Step Goal & Calorie Breakdown Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>오늘 걸음</span>
            <button onClick={() => onOpenLogModal('goal')} className="text-emerald-400 hover:underline text-[10px]">
              목표 수정
            </button>
          </div>
          <div className="font-sora font-extrabold text-2xl text-white tabular-nums">
            {steps.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-400 mt-0.5 font-semibold">목표 대비 {stepPercent}% 달성</p>
          <div className="w-full h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-[#10b981] rounded-full" style={{ width: `${stepPercent}%` }} />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>칼로리 소모</span>
            <span className="text-orange-400 font-semibold">{calories} kcal</span>
          </div>
          <div className="font-sora font-extrabold text-2xl text-white tabular-nums">
            {calories} <span className="text-xs text-slate-400 font-normal">/ {calorieGoal}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">기초대사 1,650 kcal 포함</p>
          <div className="w-full h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-[#f97316] rounded-full" style={{ width: `${Math.min(100, Math.round((calories / calorieGoal) * 100))}%` }} />
          </div>
        </div>
      </div>

      {/* Hourly Step Distribution Chart */}
      <div className="glass-card rounded-2xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-sora font-bold text-sm text-white">시간대별 걸음 수 그래프</h4>
            <p className="text-[11px] text-slate-400">오전 06:00 ~ 오후 20:00 기록</p>
          </div>
          <button
            onClick={() => addSteps(100)}
            className="px-2.5 py-1 rounded-lg bg-[#10b981]/20 text-[#4edea3] text-[11px] font-semibold border border-[#10b981]/30 hover:bg-[#10b981]/30 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>+100보 테스트</span>
          </button>
        </div>

        <div className="h-28 flex items-end justify-between gap-2 pt-2">
          {hourlyData.map((item, idx) => {
            const heightPct = Math.min(100, Math.round((item.steps / 2200) * 100));
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div className="text-[9px] text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  {item.steps}
                </div>
                <div className="w-full bg-slate-800 rounded-t-md h-20 flex items-end overflow-hidden p-0.5">
                  <div
                    className="w-full bg-gradient-to-t from-[#059669] via-[#10b981] to-[#6ffbbe] rounded-t-md transition-all duration-500"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{item.hour}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Workout History */}
      <div className="glass-card rounded-2xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-sora font-bold text-sm text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>최근 기록된 운동 세션</span>
          </h4>
          <span className="text-[11px] text-slate-400">총 {workoutHistory.length}개 항목</span>
        </div>

        <div className="space-y-2">
          {workoutHistory.map((rec) => (
            <div
              key={rec.id}
              className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#10b981]/20 border border-[#10b981]/30 flex items-center justify-center text-[#4edea3]">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-sora font-bold text-xs text-white">{rec.title}</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {rec.date} · {rec.durationMinutes}분 수행
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="font-sora font-bold text-xs text-emerald-400 tabular-nums">
                  +{rec.caloriesBurned} kcal
                </div>
                {rec.distanceKm && (
                  <div className="text-[10px] text-slate-400 tabular-nums">{rec.distanceKm} km</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
