import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, CheckCircle2 } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AICoachModal: React.FC<AICoachModalProps> = ({ isOpen, onClose }) => {
  const { healthState } = useHealth();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: `안녕하세요! **VitalPulse 수석 AI 건강 코치**입니다. 
오늘 ${healthState.steps.toLocaleString()}걸음, ${healthState.calories}kcal 소모, 수면 점수 ${healthState.sleepScore}점을 기록 중이시네요! 

궁금하신 건강 관리법이나 오늘 맞춤 운동/수면 개선 팁을 물어보세요.`,
    },
  ]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || prompt;
    if (!textToSend.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: 'user', text: textToSend }]);
    if (!queryText) setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          steps: healthState.steps,
          calories: healthState.calories,
          sleepHours: healthState.sleepHours,
          sleepScore: healthState.sleepScore,
          userPrompt: textToSend,
        }),
      });

      const data = await res.json();
      if (res.ok && data.text) {
        setMessages((prev) => [...prev, { sender: 'ai', text: data.text }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: data.error || 'AI 코치 응답을 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: '네트워크 연결 상태를 확인하고 다시 시도해 주세요.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    '오늘 내 수면 점수를 높이기 위한 야간 조언은?',
    '남은 걸음 목표를 채우기 위한 15분 액션 플랜',
    '기초대사량과 현재 소모 칼로리 비교 분석',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md transition-all">
      <div className="glass-card w-full max-w-md h-[85vh] sm:h-[600px] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden border border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Modal Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#171b26]/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/40 flex items-center justify-center text-[#c0c1ff]">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="font-sora font-bold text-sm text-white flex items-center gap-1.5">
                <span>VitalPulse AI 건강 코치</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-normal">
                  Gemini 2.5
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">실시간 생체 바이탈 기반 1:1 리포트</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#0f131d]/60 text-xs leading-relaxed">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-6 h-6 rounded-full bg-[#6366f1] flex items-center justify-center text-white shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-3 ${
                  m.sender === 'user'
                    ? 'bg-[#10b981] text-[#002113] font-medium rounded-tr-xs'
                    : 'bg-[#1c1f2a] text-slate-200 border border-white/10 rounded-tl-xs whitespace-pre-wrap'
                }`}
              >
                {m.text}
              </div>
              {m.sender === 'user' && (
                <div className="w-6 h-6 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center text-[#4edea3] shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-6 h-6 rounded-full bg-[#6366f1] flex items-center justify-center text-white shrink-0">
                <Bot className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="bg-[#1c1f2a] border border-white/10 rounded-2xl rounded-tl-xs p-3 text-slate-400 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6366f1] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#6366f1] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#6366f1] animate-bounce [animation-delay:0.4s]" />
                <span>바이탈 신호 분석 중...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 px-3 bg-[#111827] border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              disabled={loading}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-slate-300 whitespace-nowrap transition-colors shrink-0"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#171b26] border-t border-white/10 flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="건강 관리나 수면 팁을 물어보세요..."
            disabled={loading}
            className="flex-1 bg-[#0f131d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6366f1] transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !prompt.trim()}
            className="w-9 h-9 rounded-xl bg-[#10b981] disabled:bg-slate-700 text-[#002113] font-bold flex items-center justify-center transition-all active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
