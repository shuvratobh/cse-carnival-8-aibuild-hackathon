import { getSchedules, getRooms, getEvents, getAnnouncements, getAssignments } from "@/actions";
import DashboardClient from "@/components/DashboardClient";
import ChatAgent from "@/components/ChatAgent";

export default async function Home() {
  const [schedules, rooms, events, announcements, assignments] = await Promise.all([
    getSchedules(),
    getRooms(),
    getEvents(),
    getAnnouncements(),
    getAssignments(),
  ]);

  return (
    <main className="min-h-screen p-6 flex flex-col md:flex-row gap-6">
      {/* Sidebar for Chat Agent */}
      <div className="w-full md:w-1/3 glass-card flex flex-col overflow-hidden h-[calc(100vh-3rem)]">
        <div className="p-6 border-b border-[var(--color-card-border)]">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            CampusOS
          </h1>
          <p className="text-sm text-gray-400 mt-1">Your AI Campus Assistant</p>
        </div>
        <ChatAgent />
      </div>

      {/* Main Dashboard Area */}
      <div className="w-full md:w-2/3 flex flex-col gap-6">
        <DashboardClient
          initialSchedules={schedules}
          initialRooms={rooms}
          initialEvents={events}
          initialAnnouncements={announcements}
          initialAssignments={assignments}
        />
      </div>
    </main>
  );
}
