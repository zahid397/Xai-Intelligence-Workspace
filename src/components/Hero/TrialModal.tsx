'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/UI/Modal';

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TrialModal({ isOpen, onClose }: TrialModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resultEmail, setResultEmail] = useState('');
  const [resultCompany, setResultCompany] = useState('');

  function handleClose() {
    onClose();
    // Reset after the exit animation finishes so the form doesn't visibly
    // flash back to empty while the modal is still closing.
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setCompany('');
    }, 300);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    // This is a mock demo, not a real signup — so it never dead-ends on
    // validation. If a field was left empty, fall back to a sensible demo
    // value rather than blocking submission (a previous version used native
    // `required` fields with placeholder text realistic enough to look like
    // already-entered data, which meant clicking submit on a genuinely
    // empty field just silently re-showed a browser tooltip — confusing,
    // and fixed here for good).
    setResultEmail(email.trim() || 'you@company.com');
    setResultCompany(company.trim() || 'your workspace');
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Start your intelligence workspace">
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 py-6 text-center"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <p className="font-semibold text-ink-100">Workspace created</p>
          <p className="max-w-xs text-sm text-ink-400">
            Check <span className="text-ink-200">{resultEmail}</span> for a link to finish setting
            up {resultCompany}.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Name" value={name} onChange={setName} placeholder="Full name" />
          <Field
            label="Work email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@company.com"
          />
          <Field label="Company" value={company} onChange={setCompany} placeholder="Company name" />

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-xl bg-cta py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cta-hover disabled:opacity-60"
          >
            {submitting ? 'Creating workspace…' : 'Create workspace'}
          </button>
        </form>
      )}
    </Modal>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  const id = `trial-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-ink-400">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/10 bg-void-800/60 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-500/70 focus:border-signal-500/50 focus:outline-none"
      />
    </div>
  );
}
