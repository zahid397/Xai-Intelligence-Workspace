'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  // Keep the ref current every render — cheap, and lets the escape-key
  // handler below always call the latest onClose without needing onClose
  // in the setup effect's dependency array (see why that was the bug, below).
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onCloseRef.current();
    }
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
    // Intentionally depends on `isOpen` only. This effect's job is "run once
    // when the modal opens" (focus + escape binding + scroll lock). Including
    // `onClose` here was the actual bug: parents commonly pass an inline
    // `onClose={() => setOpen(false)}`, a new function on every parent
    // render — and a parent can re-render very often for reasons that have
    // nothing to do with the modal (Hero re-renders on every mousemove pixel
    // for its parallax effect). Each of those re-renders was re-running this
    // effect and stealing focus back to the close button mid-keystroke,
    // which made typing in the form feel completely broken.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-void/80 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong relative z-10 w-full max-w-md rounded-2xl p-6 shadow-glow"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 id="modal-title" className="text-lg font-semibold text-ink-100">
                {title}
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-lg p-1.5 text-ink-500 transition-colors hover:bg-white/5 hover:text-ink-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
