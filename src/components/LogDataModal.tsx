import React, { useState } from 'react';
import { X, Footprints, Droplets, Moon, Target, Plus, Check } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

interface LogDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'steps' | 'water' | 'sleep' | 'goal';
}

export const LogDataModal: React.FC<LogDataModalProps> = ({ isOpen, onClose, initialTab = 'steps' }) => {
  const { healthState, addSteps, addWater, logSleepData, updateStepGoal } = useHealth();
  const [activeTab, setActiveTab] = useState<'steps' | 'water' | 'sleep' | 'goal'>(initialTab);

  const [stepInput, setStepInput] = useState('500');
  const [waterInput, setWaterInput] = useState('250');
  const [sleepHoursInput, setSleepHoursInput] = useState('8.0');
  const [sleepScoreInput, setSleepScoreInput] = useState('90');
  const [goalInput, setGoalInput] = useState(healthState.stepGoal.toString());
  const [loggedNotice, setLoggedNotice] = useState('');

  if (!isOpen) return null;

  const handleLogSteps = (amount: number) => {
    addSteps(amount);
    setLoggedNotice(`+${amount.toLocaleString()} 걸음이 추가되었습니다!`);
    setTimeout(() => setLoggedNotice(''), 2000);
  };

  const handleLogWater = (amount: number) => {
    addWater(amount);
    setLoggedNotice(`+${amount}ml 수분이 기록되었습니다!`);
    setTimeout(() => setLoggedNotice(''), 2000);
  };

  const handleSaveSleep = () => {
    const hours = parseFloat(sleepHoursInput) || 7.5;
    const score = parseInt(sleepScoreInput) || 85;
    logSleepData(hours, score);
    setLoggedNotice(`수면 시간 ${hours}시간 (${score}점) 기록 완료!`);
    setTimeout(() => setLoggedNotice(''), 2000);
  };

  const handleSaveGoal = () => {
    const newGoal = parseInt(goalInput) || 10000;
    updateStepGoal(newGoal);
    setLoggedNotice(`일일 목표 걸음이 ${newGoal.toLocaleString()}보로 변경되었습니다!`);
    setTimeout(() => setLoggedNotice(''), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md transition-all">
      <div className="glass-card w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 border border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <h3 className="font-sora font-bold text-base text-white">건강 데이터 기입</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 p-1 bg-[#111827] rounded-xl mb-5">
          <button
            onClick={() => setActiveTab('steps')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'steps' ? 'bg-[#10b981] text-[#002113]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>걸음</span>
          </button>

          <button
            onClick={() => setActiveTab('water')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'water' ? 'bg-[#3b82f6] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>수분</span>
          </button>

          <button
            onClick={() => setActiveTab('sleep')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'sleep' ? 'bg-[#6366f1] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>수면</span>
          </button>

          <button
            onClick={() => setActiveTab('goal')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'goal' ? 'bg-[#f97316] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>목표</span>
          </button>
        </div>

        {loggedNotice && (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-pulse">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{loggedNotice}</span>
          </div>
        )}

        {/* Tab Contents */}
        {activeTab === 'steps' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">빠른 버튼 클릭 또는 원하는 걸음 수를 입력하세요.</p>
            <div className="grid grid-cols-3 gap-2">
              {[100, 500, 1000, 2000, 3000, 5000].map((num) => (
                <button
                  key={num}
                  onClick={() => handleLogSteps(num)}
                  className="py-2.5 rounded-xl bg-white/5 hover:bg-[#10b981]/20 border border-white/10 hover:border-[#10b981]/40 text-xs font-semibold text-slate-200 hover:text-[#4edea3] transition-all flex items-center justify-center gap-1 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>+{num.toLocaleString()}보</span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 flex gap-2">
              <input
                type="number"
                value={stepInput}
                onChange={(e) => setStepInput(e.target.value)}
                placeholder="직접 걸음 입력"
                className="flex-1 bg-[#0f131d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
              <button
                onClick={() => handleLogSteps(parseInt(stepInput) || 0)}
                className="px-4 py-2 bg-[#10b981] text-[#002113] font-bold text-xs rounded-xl hover:bg-[#6ffbbe] transition-colors"
              >
                기록하기
              </button>
            </div>
          </div>
        )}

        {activeTab === 'water' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              오늘 수분 섭취량: <span className="text-blue-400 font-bold">{healthState.waterMl}ml</span> / {healthState.waterGoalMl}ml
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[200, 250, 350, 500].map((ml) => (
                <button
                  key={ml}
                  onClick={() => handleLogWater(ml)}
                  className="py-2.5 rounded-xl bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/40 text-xs font-semibold text-slate-200 hover:text-blue-300 transition-all flex items-center justify-center gap-1 active:scale-95"
                >
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  <span>+{ml}ml</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sleep' && (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">수면 시간 (시간)</label>
              <input
                type="number"
                step="0.5"
                value={sleepHoursInput}
                onChange={(e) => setSleepHoursInput(e.target.value)}
                className="w-full bg-[#0f131d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">수면 점수 (0 ~ 100)</label>
              <input
                type="number"
                value={sleepScoreInput}
                onChange={(e) => setSleepScoreInput(e.target.value)}
                className="w-full bg-[#0f131d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <button
              onClick={handleSaveSleep}
              className="w-full py-2.5 bg-[#6366f1] text-white font-bold text-xs rounded-xl hover:bg-[#8183f4] transition-colors mt-2"
            >
              수면 리포트 저장
            </button>
          </div>
        )}

        {activeTab === 'goal' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">일일 걸음 목표를 변경하세요.</p>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">목표 걸음 수</label>
              <input
                type="number"
                step="500"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="w-full bg-[#0f131d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <button
              onClick={handleSaveGoal}
              className="w-full py-2.5 bg-[#f97316] text-white font-bold text-xs rounded-xl hover:bg-[#fb8c38] transition-colors mt-2"
            >
              목표 업데이트
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
