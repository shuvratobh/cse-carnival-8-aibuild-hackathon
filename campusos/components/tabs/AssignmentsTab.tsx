'use client';

import { useState } from 'react';
import DataTable from '../DataTable';
import Modal from '../Modal';
import { addAssignment, updateAssignment, deleteAssignment } from '@/actions';

export default function AssignmentsTab({ data }: { data: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);

  const columns = [
    { key: 'course', label: 'Course' },
    { key: 'title', label: 'Title' },
    { key: 'deadline', label: 'Deadline' },
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
      course: formData.get('course') as string,
      course_title: formData.get('course_title') as string || '',
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      assigned_date: formData.get('assigned_date') as string || new Date().toISOString().split('T')[0],
      deadline: formData.get('deadline') as string,
      submission_platform: formData.get('submission_platform') as string,
      status: formData.get('status') as string,
      marks: parseInt(formData.get('marks') as string) || 0,
    };

    if (editingData) {
      await updateAssignment(editingData.id, payload);
    } else {
      await addAssignment(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this assignment?')) {
      await deleteAssignment(id);
    }
  };

  return (
    <>
      <DataTable
        title="Assignments"
        columns={columns}
        data={data}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingData ? 'Edit Assignment' : 'Add New Assignment'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Course Code
              <input name="course" required defaultValue={editingData?.course} className="glass-input" placeholder="e.g. CSE 4113" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Course Title
              <input name="course_title" required defaultValue={editingData?.course_title} className="glass-input" placeholder="e.g. Pattern Recognition" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300 col-span-2">
              Assignment Title
              <input name="title" required defaultValue={editingData?.title} className="glass-input" placeholder="Assignment Title" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Assigned Date
              <input name="assigned_date" type="date" required defaultValue={editingData?.assigned_date || new Date().toISOString().split('T')[0]} className="glass-input" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Deadline
              <input name="deadline" type="date" required defaultValue={editingData?.deadline} className="glass-input" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Status
              <select name="status" defaultValue={editingData?.status || 'pending'} className="glass-input bg-[#1a1a1f]">
                <option value="pending">Pending</option>
                <option value="submitted">Submitted</option>
                <option value="graded">Graded</option>
                <option value="late">Late</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Submission Platform / Link
              <input name="submission_platform" required defaultValue={editingData?.submission_platform} className="glass-input" placeholder="e.g. Moodle / GitHub" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Marks
              <input name="marks" type="number" required defaultValue={editingData?.marks || 0} className="glass-input" placeholder="e.g. 10" />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm text-gray-300">
            Description
            <textarea name="description" required defaultValue={editingData?.description} className="glass-input h-24" placeholder="Assignment details..." />
          </label>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
              Cancel
            </button>
            <button type="submit" className="premium-btn">
              {editingData ? 'Save Changes' : 'Add Assignment'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
