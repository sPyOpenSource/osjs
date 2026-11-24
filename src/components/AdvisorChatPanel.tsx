import React, { useEffect, useRef, useState } from 'react';
import { Compass, MessageCircle, RefreshCw, Send, Trash2 } from 'lucide-react';
import { CampaignScenario, Officer } from '../types';

export interface AdvisorChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface AdvisorChatPanelProps {
  officer: Officer;
  factionName: string;
  scenario: CampaignScenario;
  currentCityName: string;
  timestampLabel: string;
  seasonName: string;
  playerGold: number;
  advisorBrief: string;
  isConsultingAdvisor: boolean;
  advisorError?: string | null;
  onConsultWarCouncil: () => void;
  renderAdviceMarkdown: (text: string) => React.ReactNode;
}

export default function AdvisorChatPanel({
  officer,
  factionName,
  scenario,
  currentCityName,
  timestampLabel,
  seasonName,
  playerGold,
  advisorBrief,
  isConsultingAdvisor,
  advisorError,
  onConsultWarCouncil,
  renderAdviceMarkdown,
}: AdvisorChatPanelProps) {
  const [messages, setMessages] = useState<AdvisorChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isSending, advisorBrief]);

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isSending) return;

    const userMsg: AdvisorChatMessage = {
      id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role: 'user',
      text: trimmed,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setDraft('');
    setChatError(null);
    setIsSending(true);

    try {
      const response = await fetch('/api/advisor_chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: messages.map(m => ({ role: m.role, text: m.text })),
          context: {
            officer: {
              id: officer.id,
              name: officer.name,
              styleName: officer.styleName,
              factionId: officer.factionId,
              stats: officer.stats,
              traits: officer.traits,
              skills: officer.skills,
            },
            factionName,
            scenario: {
              id: scenario.id,
              title: scenario.title,
              year: scenario.year,
              description: scenario.description,
              victoryCondition: scenario.victoryCondition,
            },
            currentCityName,
            timestampLabel,
            seasonName,
            playerGold,
          },
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || `军师应答异常 (HTTP ${response.status})`);
      }

      const replyText = typeof payload?.reply === 'string' ? payload.reply.trim() : '';
      if (!replyText) {
        throw new Error('军师暂未给出完整策论，请重新问策。');
      }

      setMessages(prev => [
        ...prev,
        {
          id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          role: 'model',
          text: replyText,
        },
      ]);
    } catch (err: any) {
      setChatError(err?.message || '连接军机处失败，请稍后重试。');
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(draft);
  };

  const quickPrompts = [
    `当前【${scenario.title}】局势如何破局？`,
    `${officer.name}如何用兵扬长避短？`,
    `${currentCityName}内政与备战何者为先？`,
  ];

  const activeError = chatError || advisorError;

  return (
    <div id="advisor-chat-chamber" className="p-4 border-t border-slate-800/80 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-8 h-8 rounded-full border border-teal-500/30 flex items-center justify-center bg-teal-950/60 text-sm shrink-0">
            🪶
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-serif font-bold text-teal-300 leading-tight">中军帐军机处</h3>
            <p className="text-[11px] text-slate-400 font-mono truncate">卧龙孔明即时参谋对话</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {messages.length > 0 && (
            <button
              id="btn-clear-advisor-chat"
              type="button"
              onClick={() => {
                setMessages([]);
                setChatError(null);
              }}
              title="清空对话记录"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-700/80 bg-slate-900 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <Trash2 size={11} />
              <span>清空</span>
            </button>
          )}
          <button
            id="btn-evaluate-strategy-brief"
            type="button"
            onClick={onConsultWarCouncil}
            disabled={isConsultingAdvisor}
            title={`请大军师为 ${officer.name} 生成完整军略锦囊`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition disabled:opacity-50 cursor-pointer"
          >
            <Compass size={12} className={isConsultingAdvisor ? 'animate-spin' : ''} />
            <span>{isConsultingAdvisor ? '研判中' : '授计'}</span>
          </button>
        </div>
      </div>

      {/* Scrollable Chat & Brief Area */}
      <div
        id="advisor-chat-messages"
        ref={scrollRef}
        className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 min-h-[210px] max-h-[340px] overflow-y-auto flex flex-col gap-2.5"
      >
        {isConsultingAdvisor && (
          <div className="flex flex-col items-center justify-center py-6 text-center gap-2 border-b border-slate-800/60">
            <RefreshCw size={18} className="text-amber-400 animate-spin" />
            <p className="text-xs text-slate-300 font-mono">诸葛孔明正夜观星象、研判军机...</p>
          </div>
        )}

        {!isConsultingAdvisor && advisorBrief && (
          <div className="rounded-lg border border-teal-800/50 bg-slate-900/80 p-2.5">
            <div className="text-[10px] font-mono text-teal-400 mb-1.5">军略锦囊 · {officer.name}</div>
            <div className="prose prose-invert prose-xs">{renderAdviceMarkdown(advisorBrief)}</div>
          </div>
        )}

        {messages.length === 0 && !advisorBrief && !isConsultingAdvisor && (
          <div className="flex flex-col items-center justify-center py-4 text-center text-slate-500 gap-2">
            <MessageCircle size={22} className="text-slate-700" />
            <p className="text-xs font-medium text-slate-300">与军师即时对答问计</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              可直接下方提问，或择一军机速问 {officer.name}（{currentCityName}）方略：
            </p>
            <div className="flex flex-col gap-1.5 w-full pt-1">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  id={`btn-advisor-prompt-${idx}`}
                  type="button"
                  disabled={isSending}
                  onClick={() => void sendMessage(q)}
                  className="text-left text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/70 hover:border-teal-500/50 hover:text-teal-200 text-slate-300 transition cursor-pointer disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            data-testid={`advisor-msg-${msg.role}`}
            className={`flex flex-col gap-1 max-w-[92%] ${
              msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'
            }`}
          >
            <span className="text-[10px] font-mono text-slate-500 px-1">
              {msg.role === 'user' ? '主公' : '军师 · 孔明'}
            </span>
            <div
              className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-amber-500/15 border border-amber-500/35 text-amber-100'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200'
              }`}
            >
              {msg.role === 'model' ? (
                <div className="space-y-1">{renderAdviceMarkdown(msg.text)}</div>
              ) : (
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
              )}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="self-start flex items-center gap-2 rounded-xl px-3 py-2 bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
            <RefreshCw size={12} className="text-teal-400 animate-spin" />
            <span>军师斟酌回话中...</span>
          </div>
        )}

        {activeError && (
          <div
            id="advisor-chat-error"
            role="alert"
            className="rounded-lg border border-rose-500/40 bg-rose-950/40 px-2.5 py-2 text-[11px] text-rose-200 leading-snug"
          >
            {activeError}
          </div>
        )}
      </div>

      {/* Chat Composer */}
      <form id="form-advisor-chat" onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          id="input-advisor-chat"
          type="text"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          disabled={isSending}
          placeholder={`向军师问计（如：如何用好${officer.name}）...`}
          aria-label="向军师发送对话消息"
          className="flex-1 min-w-0 bg-slate-950 border border-slate-700/80 focus:border-teal-400 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 disabled:opacity-60"
        />
        <button
          id="btn-send-advisor-chat"
          type="submit"
          disabled={isSending || !draft.trim()}
          aria-label="发送给军师"
          className="shrink-0 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs inline-flex items-center gap-1 transition disabled:opacity-45 cursor-pointer"
        >
          <Send size={13} />
          <span>发送</span>
        </button>
      </form>
    </div>
  );
}
