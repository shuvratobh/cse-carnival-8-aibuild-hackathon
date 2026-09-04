'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Monitor, Users, Bell, BookOpen } from 'lucide-react';
import SchedulesTab from './tabs/SchedulesTab';
import RoomsTab from './tabs/RoomsTab';
import EventsTab from './tabs/EventsTab';
import AnnouncementsTab from './tabs/AnnouncementsTab';
import AssignmentsTab from './tabs/AssignmentsTab';

const TABS = [
  { id: 'schedules', label: 'Schedules', icon: Calendar },
  { id: 'rooms', label: 'Rooms', icon: Monitor },
  { id: 'events', label: 'Events', icon: Users },
  { id: 'announcements', label: 'Announcements', icon: Bell },
  { id: 'assignments', label: 'Assignments', icon: BookOpen },
];

export default function DashboardClient({
  initialSchedules,
  initialRooms,
  initialEvents,
  initialAnnouncements,
  initialAssignments,
}: any) {
  const [activeTab, setActiveTab] = useState('schedules');

  return (
    <div className="glass-card flex flex-col h-[calc(100vh-3rem)] overflow-hidden">
      {/* Header / Tabs */}
      <div className="flex items-center gap-2 p-4 border-b border-[var(--color-card-border)] overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              <span className="font-medium">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-blue-500/20 rounded-full border border-blue-500/30 -z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
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
