'use client';

import { useState } from 'react';
import { Download, FileText, Plus } from 'lucide-react';
import { ActionButton } from '@/components/UI/ActionButton';
import { StatusBadge } from '@/components/UI/StatusBadge';
import { EmptyState } from '@/components/UI/EmptyState';
import { useToast } from '@/components/UI/Toast';
import * as mockApi from '@/lib/mockApi';
import type { ReportItem } from '@/types';

export function ReportsTab({ initialReports }: { initialReports: ReportItem[] }) {
  const [reports, setReports] = useState(initialReports);
  const [generating, setGenerating] = useState(false);
  const { showToast } = useToast();

  async function handleGenerate() {
    setGenerating(true);
    const newReport = await mockApi.generateReport('Custom Intelligence Report');
    setReports((current) => [newReport, ...current]);
    setGenerating(false);
    showToast('Report generated', 'success');
  }

  function handleExport(name: string) {
    showToast(`${name} export prepared`, 'info');
  }

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink-200">Reports</h2>
        <ActionButton variant="primary" onClick={handleGenerate} loading={generating}>
          <Plus className="h-3.5 w-3.5" />
          Generate Report
        </ActionButton>
      </div>

      {reports.length === 0 ? (
        <EmptyState message="No reports yet. Generate your first report to see it here." />
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {reports.map((report) => (
            <li key={report.id} className="rounded-xl border border-white/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-signal-500/10 text-signal-400">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink-100">{report.name}</p>
                    <p className="mt-0.5 text-xs text-ink-500">{report.generatedAt}</p>
                  </div>
                </div>
                <StatusBadge status={report.status} />
              </div>
              <ActionButton
                className="mt-4 w-full"
                onClick={() => handleExport(report.name)}
                disabled={report.status === 'generating'}
              >
                <Download className="h-3 w-3" />
                Export PDF
              </ActionButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
