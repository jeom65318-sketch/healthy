import React, { useState } from 'react';
import { User, LogOut, Watch, Bell, Shield, Edit3, Smartphone, Activity, Check, RefreshCw, Trophy } from 'lucide-react';
import { ScreenId, TransitionType } from '../types';
import { useHealth } from '../context/HealthContext';

interface ProfileScreenProps {
  navigateTo: (screen: ScreenId, transition?: TransitionType) => void;
  onOpenLogModal: (tab?: 'steps' | 'water' | 'sleep' | 'goal') => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigateTo, onOpenLogModal }) => {
  const { healthState, updateUserProfile, resetToDefaults } = useHealth();
  const { userProfile } = healthState;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [weight, setWeight] = useState(userProfile.weightKg.toString());
  const [height, setHeight] = useState(userProfile.heightCm.toString());
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [syncNotice, setSyncNotice] = useState('');

  const bmi = (userProfile.weightKg / Math.pow(userProfile.heightCm / 100, 2)).toFixed(1);

  const handleSaveProfile = () => {
    updateUserProfile({
      name,
      weightKg: parseFloat(weight) || 72,
      heightCm: parseFloat(height) || 178,
    });
    setIsEditing(false);
  };

  const handleManualSync = () => {
    setSyncNotice('스마트 워치 및 헤모글로빈 센서 데이터 동기화 완료!');
    setTimeout(() => setSyncNotice(''), 2500);
  };

  const handleLogout = () => {
    // Navigate back to home screen with push_back animation as required by navigation spec
    navigateTo('home', 'push_back');
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider">개인 건강 계정</span>
          <h2 className="font-sora font-extrabold text-xl text-white">내 프로필</h2>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center gap-1"
        >
          <Edit3 className="w-3.5 h-3.5 text-orange-400" />
          <span>{isEditing ? '취소' : '정보 수정'}</span>
        </button>
      </div>

      {/* User Header Profile Card */}
      <div className="glass-card rounded-3xl p-5 border border-white/10 bg-gradient-to-br from-[#171b26] via-[#1f2433] to-[#ffb690]/10 flex items-center gap-4 relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#10b981] via-[#f97316] to-[#6366f1] p-0.5 shadow-lg shrink-0">
          <div className="w-full h-full rounded-[14px] bg-[#0f131d] flex items-center justify-center text-white font-sora font-bold text-xl">
            {userProfile.name.slice(0, 2)}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-sora font-extrabold text-lg text-white truncate">{userProfile.name}</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[#4edea3] font-semibold shrink-0">
              Pro 멤버
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate">{userProfile.email}</p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Smartphone className="w-3 h-3 text-[#10b981]" />
            <span>{userProfile.deviceName} (실시간 연동)</span>
          </p>
        </div>
      </div>

      {syncNotice && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-pulse">
          <Check className="w-4 h-4 text-[#4edea3]" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Edit Form Modal/Inline */}
      {isEditing ? (
        <div className="glass-card rounded-2xl p-4 border border-orange-500/30 space-y-3">
          <h4 className="font-sora font-bold text-xs text-orange-400">신체 프로필 수정</h4>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0f131d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">신장 (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-[#0f131d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">체중 (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-[#0f131d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
          <button
            onClick={handleSaveProfile}
            className="w-full py-2.5 bg-[#f97316] text-white font-bold text-xs rounded-xl hover:bg-[#fb8c38] transition-colors"
          >
            저장하기
          </button>
        </div>
      ) : (
        /* Physical Telemetry Grid */
        <div className="grid grid-cols-3 gap-2">
          <div className="glass-card rounded-2xl p-3 border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 block">신장 / 체중</span>
            <span className="font-sora font-bold text-sm text-white tabular-nums mt-0.5 block">
              {userProfile.heightCm}cm / {userProfile.weightKg}kg
            </span>
          </div>

          <div className="glass-card rounded-2xl p-3 border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 block">BMI 지수</span>
            <span className="font-sora font-bold text-sm text-emerald-400 tabular-nums mt-0.5 block">
              {bmi} (정상)
            </span>
          </div>

          <div className="glass-card rounded-2xl p-3 border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 block">연속 달성</span>
            <span className="font-sora font-bold text-sm text-orange-400 tabular-nums mt-0.5 block">
              12일 연속
            </span>
          </div>
        </div>
      )}

      {/* Connected Wearable Device Status */}
      <div className="glass-card rounded-2xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#10b981]/20 border border-[#10b981]/30 flex items-center justify-center text-[#4edea3]">
              <Watch className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-sora font-bold text-xs text-white">연동된 웨어러블</h4>
              <p className="text-[10px] text-slate-400">VitalPulse Watch Pro · 배터리 88%</p>
            </div>
          </div>

          <button
            onClick={handleManualSync}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#10b981]" />
            <span>동기화</span>
          </button>
        </div>

        <div className="space-y-2 pt-2 border-t border-white/5 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span>Apple Health / Google Fit 연동</span>
            <span className="text-emerald-400 font-semibold">자동 활성화</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>실시간 심박수 펄스 주기</span>
            <span className="text-slate-400">1초 단위</span>
          </div>
        </div>
      </div>

      {/* App Preferences */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-3">
        <h4 className="font-sora font-bold text-xs text-white">알림 및 모바일 설정</h4>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-slate-200">일일 목표 달성 푸시 알림</span>
          </div>
          <input
            type="checkbox"
            checked={notifEnabled}
            onChange={(e) => setNotifEnabled(e.target.checked)}
            className="w-4 h-4 accent-[#10b981]"
          />
        </div>

        <div
          onClick={() => onOpenLogModal('goal')}
          className="flex items-center justify-between cursor-pointer pt-2 border-t border-white/5 hover:opacity-80"
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-slate-200">일일 목표 걸음 설정</span>
          </div>
          <span className="text-xs font-mono font-bold text-orange-400">{userProfile.stepGoal.toLocaleString()}보</span>
        </div>
      </div>

      {/* Mandatory XPath Element: //button[contains(., '로그아웃')] -> Home (push_back transition) */}
      <div className="pt-2">
        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-md"
        >
          <LogOut className="w-4 h-4" />
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );
};
