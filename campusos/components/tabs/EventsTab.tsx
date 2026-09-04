'use client';

import { useState } from 'react';
import DataTable from '../DataTable';
import Modal from '../Modal';
import { addEvent, updateEvent, deleteEvent } from '@/actions';

export default function EventsTab({ data }: { data: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);

  const columns = [
    { key: 'name', label: 'Event Name' },
    { key: 'date', label: 'Date' },
    { key: 'venue', label: 'Venue' },
    { key: 'status', label: 'Status' },
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
      name: formData.get('name') as string,
      date: formData.get('date') as string,
      venue: formData.get('venue') as string,
      status: formData.get('status') as string,
      description: formData.get('description') as string,
      organizer: formData.get('organizer') as string,
    };

    if (editingData) {
      await updateEvent(editingData.id, payload);
    } else {
      await addEvent(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this event?')) {
      await deleteEvent(id);
    }
  };

  return (
    <>
      <DataTable
        title="Events & Activities"
        columns={columns}
        data={data}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingData ? 'Edit Event' : 'Add New Event'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-gray-300">
            Event Name
            <input name="name" required defaultValue={editingData?.name} className="glass-input" placeholder="e.g. AI Hackathon" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Date (YYYY-MM-DD)
              <input name="date" required defaultValue={editingData?.date} className="glass-input" placeholder="e.g. 2026-09-10" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Venue
              <input name="venue" required defaultValue={editingData?.venue} className="glass-input" placeholder="e.g. Auditorium" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Status
              <select name="status" defaultValue={editingData?.status || 'upcoming'} className="glass-input bg-[#1a1a1f]">
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Organizer
              <input name="organizer" required defaultValue={editingData?.organizer} className="glass-input" placeholder="e.g. Tech Club" />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm text-gray-300">
            Description
            <textarea name="description" required defaultValue={editingData?.description} className="glass-input h-24" placeholder="Event details..." />
          </label>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
              Cancel
            </button>
            <button type="submit" className="premium-btn">
              {editingData ? 'Save Changes' : 'Add Event'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
