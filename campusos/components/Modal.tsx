'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass-card z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex justify-between items-center p-4 border-b border-[var(--color-card-border)] bg-black/40">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button onClick={onClose} className="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
