import React, { useState } from 'react';
import { Bot, ExternalLink, HelpCircle, Loader2, Send, Sparkles, X } from 'lucide-react';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
  sources?: { title: string; uri: string }[];
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Maayong adlaw! I am your CDO Pulse AI Assistant. Ask me anything about Cagayan de Oro City — from Mayor Klarex Uy’s advisories, traffic updates in Carmen/Lapasan, emergency hotlines, to hospital services and local events!',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickQuestions = [
    'What are the emergency hotlines in CDO?',
    'Where is NMMC Hospital located?',
    'What is the status of the CDO River?',
    'What are the latest traffic advisories in Lapasan?',
    'How do I contact Mayor Klarex Uy’s office?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || loading) return;

    const userMsg: Message = { role: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/cdo-ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });
      const data = await res.json();

      if (data.success && data.answer) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: data.answer,
            sources: data.sources || [],
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'I could not retrieve live details right now. Please try again or check the main feed above.',
          },
        ]);
      }
    } catch (err: any) {
      console.error('Error querying CDO AI:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Network error occurred while fetching Cagayan de Oro data.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg h-full bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base">CDO Pulse AI Assistant</h2>
                <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-purple-500/30">
                  Search Grounded
                </span>
              </div>
              <p className="text-xs text-slate-400">Ask real-time questions about CDO</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Questions Chips */}
        <div className="p-3 bg-slate-950/50 border-b border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-1.5">
          <span className="text-[10px] text-amber-400 font-bold uppercase flex-shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Quick Ask:
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors border border-slate-700/60"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Feed */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {msg.text}

                {/* Grounding Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-700/80 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 block uppercase">
                      Grounding References:
                    </span>
                    <ul className="space-y-1">
                      {msg.sources.slice(0, 3).map((src, sIdx) => (
                        <li key={sIdx}>
                          <a
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-indigo-300 hover:underline flex items-center gap-1 truncate"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            <span className="truncate">{src.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-slate-950 p-3 rounded-xl border border-slate-800 w-max">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Searching real-time Cagayan de Oro sources...</span>
            </div>
          )}
        </div>

        {/* Prompt Input */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about Cagayan de Oro..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !inputPrompt.trim()}
            className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
