'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TabSkeleton } from '@/components/UI/Skeleton';
import * as mockApi from '@/lib/mockApi';
import type {
  AIModelCard,
  AutomationItem,
  ConnectedDataSource,
  DashboardTabId,
  InsightRow,
  ReportItem,
  SettingsState,
} from '@/types';
import { OverviewTab } from './tabs/OverviewTab';
import { DataSourcesTab } from './tabs/DataSourcesTab';
import { AIModelsTab } from './tabs/AIModelsTab';
import { InsightsTab } from './tabs/InsightsTab';
import { AutomationsTab } from './tabs/AutomationsTab';
import { ReportsTab } from './tabs/ReportsTab';
import { SettingsTab } from './tabs/SettingsTab';

type TabData =
  | { tab: 'overview' }
  | { tab: 'sources'; sources: ConnectedDataSource[] }
  | { tab: 'models'; models: AIModelCard[] }
  | { tab: 'insights'; insights: InsightRow[] }
  | { tab: 'automations'; automations: AutomationItem[] }
  | { tab: 'reports'; reports: ReportItem[] }
  | { tab: 'settings'; settings: SettingsState };

async function fetchTabData(tab: DashboardTabId): Promise<TabData> {
  switch (tab) {
    case 'overview':
      // Overview's own charts/KPIs already read mockData directly (that part
      // wasn't broken) — this call just keeps the loading-latency feel
      // consistent with every other tab switch.
      await mockApi.getOverviewData();
      return { tab: 'overview' };
    case 'sources':
      return { tab: 'sources', sources: await mockApi.getDataSources() };
    case 'models':
      return { tab: 'models', models: await mockApi.getAIModels() };
    case 'insights':
      return { tab: 'insights', insights: await mockApi.getInsights() };
    case 'automations':
      return { tab: 'automations', automations: await mockApi.getAutomations() };
    case 'reports':
      return { tab: 'reports', reports: await mockApi.getReports() };
    case 'settings':
      return { tab: 'settings', settings: await mockApi.getSettings() };
  }
}

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTabId>('overview');
  const [activeModelName, setActiveModelName] = useState('GPT-4o');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TabData>({ tab: 'overview' });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchTabData(activeTab).then((result) => {
      if (!cancelled) {
        setData(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  return (
    <section id="workspace" className="scroll-mt-16 px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-ink-100 sm:text-4xl">
          The intelligence workspace
        </h2>
        <p className="mt-4 text-ink-400">
          Every insight, source, and automation — unified in one command center. Click any tab
          on the left; this is a working preview, not a static mockup.
        </p>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-4 md:flex-row">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} systemHealth={98} />

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Header activeModelName={activeModelName} />

          <AnimatePresence mode="wait">
            <motion.div
              key={loading ? `${activeTab}-loading` : activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {loading || data.tab !== activeTab ? (
                <TabSkeleton />
              ) : data.tab === 'overview' ? (
                <OverviewTab />
              ) : data.tab === 'sources' ? (
                <DataSourcesTab initialSources={data.sources} />
              ) : data.tab === 'models' ? (
                <AIModelsTab initialModels={data.models} onActiveModelChange={setActiveModelName} />
              ) : data.tab === 'insights' ? (
                <InsightsTab initialInsights={data.insights} />
              ) : data.tab === 'automations' ? (
                <AutomationsTab initialAutomations={data.automations} />
              ) : data.tab === 'reports' ? (
                <ReportsTab initialReports={data.reports} />
              ) : (
                <SettingsTab initialSettings={data.settings} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
