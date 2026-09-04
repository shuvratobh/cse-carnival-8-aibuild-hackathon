// @ts-nocheck
'use client';

import { useChat } from '@ai-sdk/react';
import { Send, Bot, User, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatAgent() {
  const { messages, sendMessage, status, error } = useChat({
    maxSteps: 5,
  });
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-transparent to-black/20 overflow-hidden relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 px-4">
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 blur-lg" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center border border-blue-500/15 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                <Bot size={26} className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-300 mb-1">How can I help?</p>
              <p className="text-xs text-slate-500 max-w-[220px] leading-relaxed">Ask about schedules, rooms, events, announcements, or assignments</p>
            </div>
            {/* Quick action chips */}
            <div className="flex flex-wrap gap-1.5 justify-center mt-1">
              {['What classes today?', 'Free rooms?', 'Upcoming events'].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="text-[10px] px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-white hover:border-blue-500/25 hover:bg-blue-500/5 transition-all duration-200"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                m.role === 'user' 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-[0_2px_8px_rgba(59,130,246,0.3)]' 
                  : 'bg-slate-800/80 border border-slate-700/50'
              }`}>
                {m.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-blue-400" />}
              </div>
              <div className={`px-3.5 py-2.5 rounded-2xl max-w-[85%] text-[13px] leading-relaxed ${
                m.role === 'user'
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-sm shadow-[0_4px_16px_rgba(59,130,246,0.2)]'
                  : 'bg-white/[0.04] text-slate-200 border border-white/[0.06] rounded-tl-sm shadow-[0_2px_12px_rgba(0,0,0,0.15)]'
              }`}>
                {(() => {
                  let textToRender = '';
                  if (typeof m.content === 'string' && m.content) textToRender = m.content;
                  else if (Array.isArray(m.parts)) {
                    textToRender = m.parts
                      .filter((p: any) => p.type === 'text')
                      .map((p: any) => p.text)
                      .join('');
                  }
                  
                  if (textToRender) {
                    return (
                      <div className={`prose prose-sm max-w-none ${m.role === 'user' ? 'prose-invert text-white' : 'prose-invert text-slate-200'} prose-p:leading-relaxed prose-p:my-1 prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/5 prose-th:text-slate-300 prose-td:text-slate-300 prose-code:text-blue-300 prose-strong:text-white`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {textToRender}
                        </ReactMarkdown>
                      </div>
                    );
                  }
                  return m.role === 'assistant' ? (
                    <span className="text-slate-400 text-xs italic">Processing...</span>
                  ) : "";
                })()}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2.5"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center shrink-0">
                <Bot size={14} className="text-blue-400" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] rounded-tl-sm flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400/80 animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400/80 animate-bounce [animation-delay:0.15s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400/80 animate-bounce [animation-delay:0.3s]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-rose-500/8 border border-rose-500/15 text-rose-300 text-xs flex items-start gap-2"
          >
            <AlertCircle size={14} className="shrink-0 mt-0.5 text-rose-400" />
            <div>
              <p className="font-semibold mb-0.5">Connection Error</p>
              <p className="text-rose-300/70">{error.message}</p>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        const text = input;
        setInput('');
        sendMessage({ text });
      }} className="p-3 bg-gradient-to-t from-black/40 to-transparent border-t border-white/[0.04] relative z-10">
        <div className="relative flex items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your campus assistant..."
            className="w-full glass-input pr-12 text-sm h-11 rounded-xl"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-400 hover:to-blue-500 disabled:opacity-30 disabled:hover:from-blue-500 disabled:hover:to-blue-600 transition-all duration-200 shadow-[0_2px_8px_rgba(59,130,246,0.3)] disabled:shadow-none"
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}
