'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Monitor, Users, Bell, BookOpen, Clock, Building2, CheckCircle2, TrendingUp } from 'lucide-react';
import SchedulesTab from './tabs/SchedulesTab';
import RoomsTab from './tabs/RoomsTab';
import EventsTab from './tabs/EventsTab';
import AnnouncementsTab from './tabs/AnnouncementsTab';
import AssignmentsTab from './tabs/AssignmentsTab';

export default function DashboardClient({
  initialSchedules = [],
  initialRooms = [],
  initialEvents = [],
  initialAnnouncements = [],
  initialAssignments = [],
}: any) {
  const [activeTab, setActiveTab] = useState('schedules');

  const availableRoomsCount = initialRooms.filter((r: any) => r.status?.toLowerCase() === 'available').length;
  const pendingAssignmentsCount = initialAssignments.filter((a: any) => a.status?.toLowerCase() === 'pending').length;

  const TABS = [
    { id: 'schedules', label: 'Schedules', icon: Calendar, count: initialSchedules.length },
    { id: 'rooms', label: 'Rooms', icon: Monitor, count: initialRooms.length },
    { id: 'events', label: 'Events', icon: Users, count: initialEvents.length },
    { id: 'announcements', label: 'Announcements', icon: Bell, count: initialAnnouncements.length },
    { id: 'assignments', label: 'Assignments', icon: BookOpen, count: initialAssignments.length },
  ];

  const metrics = [
    {
      label: 'Active Classes',
      value: initialSchedules.length,
      suffix: 'Scheduled',
      icon: Clock,
      color: 'blue',
      gradient: 'from-blue-500/12 to-blue-600/5',
      iconBg: 'bg-blue-500/10 border-blue-500/20',
      iconColor: 'text-blue-400',
      valueColor: 'text-white',
      glowColor: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.08)]',
    },
    {
      label: 'Free Rooms',
      value: availableRoomsCount,
      suffix: `of ${initialRooms.length}`,
      icon: Building2,
      color: 'emerald',
      gradient: 'from-emerald-500/12 to-emerald-600/5',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
      iconColor: 'text-emerald-400',
      valueColor: 'text-emerald-400',
      glowColor: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]',
    },
    {
      label: 'Campus Events',
      value: initialEvents.length,
      suffix: 'Listed',
      icon: TrendingUp,
      color: 'indigo',
      gradient: 'from-indigo-500/12 to-indigo-600/5',
      iconBg: 'bg-indigo-500/10 border-indigo-500/20',
      iconColor: 'text-indigo-400',
      valueColor: 'text-white',
      glowColor: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.08)]',
    },
    {
      label: 'Pending Tasks',
      value: pendingAssignmentsCount,
      suffix: 'Due',
      icon: CheckCircle2,
      color: 'amber',
      gradient: 'from-amber-500/12 to-amber-600/5',
      iconBg: 'bg-amber-500/10 border-amber-500/20',
      iconColor: 'text-amber-400',
      valueColor: 'text-amber-400',
      glowColor: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]',
    },
  ];

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden relative">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent z-10" />

      {/* Quick Metrics Strip */}
      <div className="p-3.5 border-b border-white/[0.04] bg-gradient-to-b from-slate-950/40 to-transparent grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className={`group flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-br ${m.gradient} border border-white/[0.05] transition-all duration-300 cursor-default ${m.glowColor} hover:border-white/[0.1]`}
            >
              <div className={`w-9 h-9 rounded-lg ${m.iconBg} border flex items-center justify-center ${m.iconColor} shrink-0 transition-transform group-hover:scale-105`}>
                <Icon size={17} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest truncate">{m.label}</div>
                <div className={`text-lg font-bold ${m.valueColor} leading-tight tabular-nums`}>
                  {m.value} <span className="text-[10px] text-slate-600 font-normal">{m.suffix}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1 px-3 py-2.5 border-b border-white/[0.04] bg-slate-950/20 overflow-x-auto scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm transition-all duration-200 whitespace-nowrap ${
                isActive ? 'text-white font-semibold' : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-blue-400 drop-shadow-[0_0_6px_rgba(59,130,246,0.4)]' : 'text-slate-500'} />
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-mono font-semibold transition-all ${
                isActive 
                  ? 'bg-blue-500/25 text-blue-200 border border-blue-400/30 shadow-[0_0_8px_rgba(59,130,246,0.15)]' 
                  : 'bg-white/[0.03] text-slate-500 border border-transparent'
              }`}>
                {tab.count}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-indigo-600/15 to-blue-500/8 rounded-xl border border-blue-500/25 shadow-[0_0_16px_rgba(59,130,246,0.12)] -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            {activeTab === 'schedules' && <SchedulesTab data={initialSchedules} />}
            {activeTab === 'rooms' && <RoomsTab data={initialRooms} />}
            {activeTab === 'events' && <EventsTab data={initialEvents} />}
            {activeTab === 'announcements' && <AnnouncementsTab data={initialAnnouncements} />}
            {activeTab === 'assignments' && <AssignmentsTab data={initialAssignments} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
