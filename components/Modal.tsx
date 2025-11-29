import React, { ReactNode } from 'react';
import { XCircleIcon } from './icons';

interface ModalProps {
  title: string;
  onClose: () => void;
  // FIX: Make children optional to resolve incorrect TypeScript errors.
  children?: ReactNode;
}

const Modal = ({ title, onClose, children }: ModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-40" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="bg-v3-surface rounded-lg w-full max-w-md h-[85vh] max-h-[700px] border border-v3-border shadow-2xl animate-fade-in-up flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-v3-border flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-v3-text-secondary hover:text-v3-text-primary" aria-label="Close modal">
            <XCircleIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="flex-grow overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Modal;