import { getSchedules, getRooms, getEvents, getAnnouncements, getAssignments } from "@/actions";
import DashboardClient from "@/components/DashboardClient";
import ChatAgent from "@/components/ChatAgent";
import { Sparkles, ShieldCheck, GraduationCap, Zap, Cpu } from "lucide-react";

export default async function Home() {
  const [schedules, rooms, events, announcements, assignments] = await Promise.all([
    getSchedules(),
    getRooms(),
    getEvents(),
    getAnnouncements(),
    getAssignments(),
  ]);

  return (
    <div className="min-h-screen flex flex-col p-3 md:p-5 max-w-[1700px] mx-auto gap-3 md:gap-4">
      {/* Top Futuristic Header Bar */}
      <header className="glass-card px-5 py-3 flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        {/* Subtle animated gradient border glow at top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
        
        <div className="flex items-center gap-3.5">
          {/* Logo with double-ring glow */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-cyan-500/20 blur-md" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-[0_0_24px_rgba(59,130,246,0.3)]">
              <div className="w-full h-full bg-[#080c18] rounded-[11px] flex items-center justify-center">
                <GraduationCap size={20} className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent drop-shadow-sm">
                CampusOS
              </h1>
              <span className="px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded-full bg-gradient-to-r from-blue-500/15 to-indigo-500/15 text-blue-300 border border-blue-500/25 shadow-[0_0_12px_rgba(59,130,246,0.15)]">
                v2.0 PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block font-medium tracking-wide">AI-Powered University Operations Engine</p>
          </div>
        </div>

        {/* System Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Live pulse indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/8 border border-emerald-500/20 text-emerald-400 text-xs shadow-[0_0_16px_rgba(16,185,129,0.08)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"></span>
            </span>
            <span className="font-semibold text-[11px] tracking-wide">System Online</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-slate-400 text-[11px] font-mono tracking-wider">
            <Cpu size={11} className="text-indigo-400 drop-shadow-[0_0_4px_rgba(129,140,248,0.6)]" />
            <span>Gemini AI</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-slate-400 text-[11px]">
            <Zap size={11} className="text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]" />
            <span className="font-medium">Live Sync</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 flex flex-col md:flex-row gap-4 h-[calc(100vh-6.5rem)] min-h-[640px]">
        {/* Sidebar for Chat Agent */}
        <div className="w-full md:w-[380px] lg:w-[420px] shrink-0 glass-card flex flex-col overflow-hidden h-full relative">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
          <div className="p-5 border-b border-white/[0.04] bg-gradient-to-b from-slate-950/40 to-transparent">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 border border-blue-500/20 flex items-center justify-center">
                <Sparkles size={14} className="text-blue-400 drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
              </div>
              <div>
                <h2 className="text-base font-bold bg-gradient-to-r from-blue-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  AI Assistant
                </h2>
                <p className="text-[10px] text-slate-500 font-medium">Powered by Gemini — Ask anything about campus</p>
              </div>
            </div>
          </div>
          <ChatAgent />
        </div>

        {/* Main Dashboard Area */}
        <div className="flex-1 flex flex-col h-full min-w-0">
          <DashboardClient
            initialSchedules={schedules}
            initialRooms={rooms}
            initialEvents={events}
            initialAnnouncements={announcements}
            initialAssignments={assignments}
          />
        </div>
      </main>
    </div>
  );
}
