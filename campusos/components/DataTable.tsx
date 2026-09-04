'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, Edit3, Search, X, Inbox } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DataTable({ title, columns, data = [], onAdd, onEdit, onDelete }: any) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((row: any) => {
      return Object.values(row).some((val) => {
        if (typeof val === 'string' || typeof val === 'number') {
          return String(val).toLowerCase().includes(term);
        }
        return false;
      });
    });
  }, [data, searchTerm]);

  return (
    <div className="flex flex-col gap-4">
      {/* Title & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2.5">
            {title}
            <span className="text-[10px] font-mono font-semibold text-slate-500 bg-white/[0.03] px-2.5 py-0.5 rounded-full border border-white/[0.05] tabular-nums">
              {filteredData.length} records
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2.5 flex-1 sm:flex-initial justify-end">
          {/* Live Search Input */}
          <div className="relative flex items-center min-w-[180px] sm:min-w-[220px] group">
            <Search size={13} className="absolute left-3 text-slate-500 pointer-events-none group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search records..."
              className="w-full bg-slate-950/50 border border-white/[0.06] text-xs rounded-xl pl-8 pr-7 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 focus:bg-slate-950/70 transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 text-slate-500 hover:text-white transition-colors p-0.5 rounded-md hover:bg-white/5"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Add Button */}
          {onAdd && (
            <button
              onClick={onAdd}
              className="premium-btn text-xs whitespace-nowrap"
            >
              <Plus size={14} /> <span>Add Record</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-white/[0.05] bg-gradient-to-b from-slate-950/50 to-slate-950/30 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {columns.map((col: any) => (
                <th key={col.key} className="px-4 py-3.5 font-semibold text-slate-500 text-[10px] uppercase tracking-[0.1em]">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3.5 font-semibold text-slate-500 text-[10px] uppercase tracking-[0.1em] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {filteredData.map((row: any, i: number) => (
              <motion.tr
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.015, 0.2), duration: 0.2 }}
                key={row.id || i}
                className="hover:bg-white/[0.02] transition-colors duration-150 group"
              >
                {columns.map((col: any) => (
                  <td key={col.key} className="px-4 py-3 text-xs md:text-sm text-slate-300/90 font-medium">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        title="Edit record"
                        className="p-1.5 rounded-lg bg-blue-500/8 text-blue-400 hover:bg-blue-500/15 hover:text-blue-300 border border-blue-500/15 hover:border-blue-500/30 transition-all duration-200"
                      >
                        <Edit3 size={13} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row.id)}
                        title="Delete record"
                        className="p-1.5 rounded-lg bg-rose-500/8 text-rose-400 hover:bg-rose-500/15 hover:text-rose-300 border border-rose-500/15 hover:border-rose-500/30 transition-all duration-200"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="py-16 flex flex-col items-center justify-center text-slate-600 gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center">
              <Inbox size={22} className="text-slate-600" />
            </div>
            <p className="text-xs font-medium">No records found {searchTerm ? `matching "${searchTerm}"` : ''}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
