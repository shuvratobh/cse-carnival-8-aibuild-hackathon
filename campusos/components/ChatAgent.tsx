// @ts-nocheck
'use client';

import { useChat } from '@ai-sdk/react';
import { Send, Bot, User } from 'lucide-react';
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
  console.log('Chat messages:', messages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-black/20 backdrop-blur-md rounded-b-xl overflow-hidden relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 gap-3">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Bot size={32} className="text-blue-400" />
            </div>
            <p className="max-w-[200px] text-sm">Ask me about schedules, rooms, events, or announcements!</p>
          </div>
        )}

        <AnimatePresence>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-blue-600' : 'bg-gray-800 border border-gray-700'}`}>
                {m.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-blue-400" />}
              </div>
              <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white/10 text-gray-200 border border-white/10 rounded-tl-none shadow-lg'
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
                      <div className={`prose prose-sm max-w-none ${m.role === 'user' ? 'prose-invert text-white' : 'prose-invert text-gray-200'} prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-th:text-gray-300 prose-td:text-gray-300`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {textToRender}
                        </ReactMarkdown>
                      </div>
                    );
                  }
                  return m.role === 'assistant' ? "Calling a tool..." : "";
                })()}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-blue-400" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/10 rounded-tl-none flex gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {error && (
          <div className="p-3 mt-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            <p className="font-bold">AI Connection Error:</p>
            <p>{error.message}</p>
            <p className="mt-1 opacity-70">Did you add your GEMINI_API_KEY to .env.local and restart the server?</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        const text = input;
        setInput('');
        sendMessage({ content: text });
      }} className="p-4 bg-black/40 border-t border-[var(--color-card-border)] relative z-10">
        <div className="relative flex items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your campus assistant..."
            className="w-full glass-input pr-12 text-sm h-12"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
