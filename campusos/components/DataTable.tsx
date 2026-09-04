'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DataTable({ title, columns, data, onAdd, onEdit, onDelete }: any) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          onClick={onAdd}
          className="premium-btn flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-card-border)] bg-black/20 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-card-border)] bg-white/5">
              {columns.map((col: any) => (
                <th key={col.key} className="p-4 font-medium text-gray-300 text-sm">
                  {col.label}
                </th>
              ))}
              <th className="p-4 font-medium text-gray-300 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, i: number) => (
              <motion.tr
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={row.id}
                className="border-b border-[var(--color-card-border)] hover:bg-white/5 transition-colors"
              >
                {columns.map((col: any) => (
                  <td key={col.key} className="p-4 text-sm text-gray-300">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                <td className="p-4 flex justify-end gap-2">
                  <button
                    onClick={() => onEdit && onEdit(row)}
                    className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(row.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">No records found.</div>
        )}
      </div>
    </div>
  );
}
