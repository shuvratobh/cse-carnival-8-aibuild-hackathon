'use client';

import { useState } from 'react';
import DataTable from '../DataTable';
import Modal from '../Modal';
import { addSchedule, updateSchedule, deleteSchedule } from '@/actions';

export default function SchedulesTab({ data }: { data: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);

  const columns = [
    { key: 'course', label: 'Course' },
    { key: 'title', label: 'Title' },
    { key: 'day', label: 'Day' },
    { key: 'start_time', label: 'Start' },
    { key: 'end_time', label: 'End' },
    { key: 'room', label: 'Room' },
    { key: 'instructor', label: 'Instructor' },
  ];

  const handleOpenAdd = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: any) => {
    setEditingData(row);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      course: formData.get('course') as string,
      title: formData.get('title') as string,
      day: formData.get('day') as string,
      start_time: formData.get('start_time') as string,
      end_time: formData.get('end_time') as string,
      room: formData.get('room') as string,
      instructor: formData.get('instructor') as string,
      section: formData.get('section') as string,
    };

    if (editingData) {
      await updateSchedule(editingData.id, payload);
    } else {
      await addSchedule(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this schedule?')) {
      await deleteSchedule(id);
    }
  };

  return (
    <>
      <DataTable
        title="Class Schedules"
        columns={columns}
        data={data}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingData ? 'Edit Schedule' : 'Add New Schedule'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Course Code
              <input name="course" required defaultValue={editingData?.course} className="glass-input" placeholder="e.g. CSE 4113" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Title
              <input name="title" required defaultValue={editingData?.title} className="glass-input" placeholder="e.g. Pattern Recognition" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Day
              <select name="day" defaultValue={editingData?.day || 'Sunday'} className="glass-input bg-[#1a1a1f]">
                <option value="Sunday">Sunday</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Section
              <input name="section" required defaultValue={editingData?.section || 'A'} className="glass-input" placeholder="e.g. A" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Start Time
              <input name="start_time" required defaultValue={editingData?.start_time} className="glass-input" placeholder="e.g. 08:00" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              End Time
              <input name="end_time" required defaultValue={editingData?.end_time} className="glass-input" placeholder="e.g. 09:30" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Room
              <input name="room" required defaultValue={editingData?.room} className="glass-input" placeholder="e.g. 7A03" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Instructor
              <input name="instructor" required defaultValue={editingData?.instructor} className="glass-input" placeholder="e.g. Dr. Ahmed" />
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
              Cancel
            </button>
            <button type="submit" className="premium-btn">
              {editingData ? 'Save Changes' : 'Add Schedule'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
