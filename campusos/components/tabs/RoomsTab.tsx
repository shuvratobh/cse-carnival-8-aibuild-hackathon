'use client';

import { useState } from 'react';
import DataTable from '../DataTable';
import Modal from '../Modal';
import { addRoom, updateRoom, deleteRoom } from '@/actions';

export default function RoomsTab({ data }: { data: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);

  const columns = [
    { key: 'room_number', label: 'Room No.' },
    { key: 'floor', label: 'Floor' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    { 
      key: 'equipment', 
      label: 'Equipment',
      render: (val: string) => {
        try {
          const arr = JSON.parse(val);
          if (Array.isArray(arr)) {
            return (
              <div className="flex gap-1 flex-wrap">
                {arr.map((item: string, i: number) => (
                  <span key={i} className="px-2 py-1 text-xs bg-white/10 rounded-full border border-white/5">
                    {item}
                  </span>
                ))}
              </div>
            );
          }
        } catch(e) {}
        return val;
      }
    },
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
      room_number: formData.get('room_number') as string,
      floor: parseInt(formData.get('floor') as string),
      capacity: parseInt(formData.get('capacity') as string),
      type: formData.get('type') as string,
      status: formData.get('status') as string,
      equipment: formData.get('equipment') as string,
    };

    if (editingData) {
      await updateRoom(editingData.id, payload);
    } else {
      await addRoom(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this room?')) {
      await deleteRoom(id);
    }
  };

  return (
    <>
      <DataTable
        title="Rooms & Facilities"
        columns={columns}
        data={data}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingData ? 'Edit Room' : 'Add New Room'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Room Number
              <input name="room_number" required defaultValue={editingData?.room_number} className="glass-input" placeholder="e.g. 7A03" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Floor
              <input name="floor" type="number" required defaultValue={editingData?.floor} className="glass-input" placeholder="e.g. 7" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Capacity
              <input name="capacity" type="number" required defaultValue={editingData?.capacity} className="glass-input" placeholder="e.g. 40" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Type
              <select name="type" defaultValue={editingData?.type || 'classroom'} className="glass-input bg-[#1a1a1f]">
                <option value="classroom">Classroom</option>
                <option value="lab">Lab</option>
                <option value="auditorium">Auditorium</option>
                <option value="meeting_room">Meeting Room</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300 col-span-2">
              Equipment (JSON array string)
              <input name="equipment" required defaultValue={editingData?.equipment || '["Projector", "Whiteboard"]'} className="glass-input" placeholder='["Projector"]' />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-300 col-span-2">
              Status
              <select name="status" defaultValue={editingData?.status || 'Available'} className="glass-input bg-[#1a1a1f]">
                <option value="Available">Available</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Occupied">Occupied</option>
              </select>
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
              Cancel
            </button>
            <button type="submit" className="premium-btn">
              {editingData ? 'Save Changes' : 'Add Room'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
