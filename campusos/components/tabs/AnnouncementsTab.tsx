'use client';

import { useState } from 'react';
import DataTable from '../DataTable';
import Modal from '../Modal';
import { addAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/actions';

export default function AnnouncementsTab({ data }: { data: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'priority', label: 'Priority' },
    { key: 'date', label: 'Date Posted' },
    { key: 'posted_by', label: 'Posted By' },
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
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      priority: formData.get('priority') as string,
      date: formData.get('date') as string,
      posted_by: formData.get('posted_by') as string,
      audience: formData.get('audience') as string,
    };

    if (editingData) {
      await updateAnnouncement(editingData.id, payload);
    } else {
      await addAnnouncement(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this announcement?')) {
      await deleteAnnouncement(id);
    }
  };

  return (
    <>
      <DataTable
        title="Announcements"
        columns={columns}
        data={data}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingData ? 'Edit Announcement' : 'Post New Announcement'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-gray-300">
            Title
            <input name="title" required defaultValue={editingData?.title} className="glass-input" placeholder="Announcement Title" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Priority
              <select name="priority" defaultValue={editingData?.priority || 'medium'} className="glass-input bg-[#1a1a1f]">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Date (YYYY-MM-DD)
              <input name="date" required defaultValue={editingData?.date || new Date().toISOString().split('T')[0]} className="glass-input" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Posted By
              <input name="posted_by" required defaultValue={editingData?.posted_by} className="glass-input" placeholder="e.g. Admin" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Audience
              <input name="audience" required defaultValue={editingData?.audience || 'all'} className="glass-input" placeholder="e.g. all, CSE, etc." />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm text-gray-300">
            Content
            <textarea name="content" required defaultValue={editingData?.content} className="glass-input h-24" placeholder="Announcement details..." />
          </label>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
              Cancel
            </button>
            <button type="submit" className="premium-btn">
              {editingData ? 'Save Changes' : 'Post Announcement'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
