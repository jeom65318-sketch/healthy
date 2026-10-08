import React, { useState, useEffect } from 'react';
import { Moon, Sparkles, Volume2, VolumeX, Clock, ShieldCheck, Heart, Zap, Play, Pause, ChevronRight } from 'lucide-react';
import { ScreenId, TransitionType } from '../types';
import { useHealth } from '../context/HealthContext';

interface SleepScreenProps {
  navigateTo: (screen: ScreenId, transition?: TransitionType) => void;
  onOpenLogModal: (tab?: 'steps' | 'water' | 'sleep' | 'goal') => void;
  onOpenAICoach: () => void;
}

export const SleepScreen: React.FC<SleepScreenProps> = ({ navigateTo, onOpenLogModal, onOpenAICoach }) => {
  const { healthState } = useHealth();
  const { sleepHours, sleepScore, sleepStages } = healthState;

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedSound, setSelectedSound] = useState<'rain' | 'waves' | 'forest'>('rain');
  const [audioTimer, setAudioTimer] = useState(30);

  // Web Audio White Noise Simulator for relaxing bedtime sounds
  useEffect(() => {
    if (!isPlayingAudio) return;

    let audioCtx: AudioContext | null = null;
    let noiseNode: AudioNode | null = null;

    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const bufferSize = audioCtx.sampleRate * 2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Filter for ambient rain/wave effect
      const filter = audioCtx.createBiquadFilter();
      filter.type = selectedSound === 'rain' ? 'lowpass' : selectedSound === 'waves' ? 'bandpass' : 'notch';
      filter.frequency.value = selectedSound === 'rain' ? 800 : 400;

      const gain = audioCtx.createGain();
      gain.gain.value = 0.08;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start();
      noiseNode = noise;
    } catch (e) {
      console.log('Audio Context preview not supported:', e);
    }

    return () => {
      if (noiseNode) {
        try {
          (noiseNode as any).stop();
        } catch (e) {}
      }
      if (audioCtx) {
        audioCtx.close();
      }
    };
  }, [isPlayingAudio, selectedSound]);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'awake':
        return 'bg-pink-500';
      case 'rem':
        return 'bg-indigo-400';
      case 'light':
        return 'bg-[#6366f1]';
      case 'deep':
        return 'bg-[#10b981]';
      default:
        return 'bg-slate-500';
    }
  };

  const getStageName = (stage: string) => {
    switch (stage) {
      case 'awake':
        return '깨어남';
      case 'rem':
        return '렘수면 (REM)';
      case 'light':
        return '얕은 수면';
      case 'deep':
        return '깊은 수면';
      default:
        return stage;
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">서카디안 리듬 분석</span>
          <h2 className="font-sora font-extrabold text-xl text-white">수면 리포트</h2>
        </div>

        <button
          onClick={() => onOpenLogModal('sleep')}
          className="px-3 py-1.5 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/30 text-[#c0c1ff] text-xs font-semibold hover:bg-[#6366f1]/30 transition-colors"
        >
          수면 기록 수정
        </button>
      </div>

      {/* Main Sleep Score Hero Card */}
      <div className="glass-card rounded-3xl p-5 border border-[#6366f1]/30 bg-gradient-to-br from-[#111827] via-[#1a1b32] to-[#6366f1]/20 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#6366f1]/30 border border-[#6366f1]/50 flex items-center justify-center text-[#c0c1ff]">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400">어젯밤 수면 품질</span>
              <div className="font-sora font-bold text-sm text-white">최적의 회복 수면</div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-3xl font-sora font-extrabold text-[#c0c1ff] tabular-nums">{sleepScore}</span>
            <span className="text-xs text-slate-400"> / 100점</span>
          </div>
        </div>

        {/* Big Duration Readout */}
        <div className="my-4 p-4 rounded-2xl bg-[#0f131d]/60 border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400">총 수면 시간</div>
            <div className="font-sora font-extrabold text-2xl text-white tabular-nums mt-0.5">
              {Math.floor(sleepHours)}<span className="text-sm font-normal text-slate-400">시간</span> {Math.round((sleepHours % 1) * 60)}<span className="text-sm font-normal text-slate-400">분</span>
            </div>
          </div>

          <div className="space-y-1 text-right text-xs">
            <div className="text-slate-300">취침 23:20 · 기상 07:05</div>
            <div className="text-emerald-400 font-semibold flex items-center justify-end gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>수면 효율 94%</span>
            </div>
          </div>
        </div>

        {/* AI Sleep Coach Tip Button */}
        <button
          onClick={onOpenAICoach}
          className="w-full p-3 rounded-2xl bg-[#6366f1]/20 hover:bg-[#6366f1]/30 border border-[#6366f1]/40 text-left flex items-center justify-between transition-all active:scale-98 glow-indigo"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#c0c1ff] animate-pulse" />
            <span className="text-xs text-slate-200 font-medium">
              깊은 수면 비중이 22%로 매우 이상적입니다!
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#c0c1ff]" />
        </button>
      </div>

      {/* Sleep Stages Timeline Visualizer */}
      <div className="glass-card rounded-2xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-sora font-bold text-sm text-white">수면 단계별 흐름 분석</h4>
          <span className="text-[10px] text-slate-400">스마트 워치 자동 센싱</span>
        </div>

        {/* Phase Timeline Bars */}
        <div className="h-20 flex items-end gap-1 pt-2">
          {sleepStages.map((stage, i) => {
            const height =
              stage.stage === 'awake'
                ? 'h-6'
                : stage.stage === 'rem'
                ? 'h-10'
                : stage.stage === 'light'
                ? 'h-14'
                : 'h-18';

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div
                  className={`w-full rounded-t-md ${getStageColor(stage.stage)} ${height} transition-all duration-300 group-hover:brightness-125`}
                />
                <span className="text-[8px] text-slate-500 font-mono">{stage.time}</span>
              </div>
            );
          })}
        </div>

        {/* Stage Legend Pills */}
        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/5 mt-3 text-[10px]">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>깊은 수면 (22%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]" />
            <span>얕은 수면 (48%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            <span>렘수면 (26%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
            <span>깨어남 (4%)</span>
          </div>
        </div>
      </div>

      {/* Bedtime Ambience Relaxer (Audio Generator) */}
      <div className="glass-card rounded-2xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
              {isPlayingAudio ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="font-sora font-bold text-xs text-white">수면 유도 화이트 노이즈</h4>
              <p className="text-[10px] text-slate-400">뇌파 유도 평온 사운드</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {[15, 30, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => setAudioTimer(mins)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                  audioTimer === mins ? 'bg-[#6366f1] text-white' : 'bg-white/5 text-slate-400'
                }`}
              >
                {mins}분
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { id: 'rain', label: '밤빗소리' },
            { id: 'waves', label: '잔잔한 파도' },
            { id: 'forest', label: '숲속 바람' },
          ].map((snd) => (
            <button
              key={snd.id}
              onClick={() => setSelectedSound(snd.id as any)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                selectedSound === snd.id
                  ? 'bg-[#6366f1]/20 border-[#6366f1] text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-xs font-bold">{snd.label}</div>
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
          className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 ${
            isPlayingAudio
              ? 'bg-indigo-500/30 border border-indigo-500/50 text-indigo-200'
              : 'bg-[#6366f1] hover:bg-[#8183f4] text-white glow-indigo'
          }`}
        >
          {isPlayingAudio ? (
            <>
              <Pause className="w-4 h-4" />
              <span>사운드 재생 중지</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>수면 사운드 재생하기</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
