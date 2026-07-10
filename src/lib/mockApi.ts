// Mock backend layer. Every dashboard interaction goes through here instead
// of touching mockData.ts directly — this is the seam a real API client
// would slot into later, and it's why the UI can't tell the difference
// between "mock" and "real" data flow (loading states, promise rejection
// paths, and mutation all behave the way a real backend would).
import {
  ACTIVITY_FEED,
  ACTIVITY_TABLE,
  AI_MODELS,
  AUTOMATIONS,
  DATA_PROCESSING_BY_SOURCE,
  DATA_SOURCES,
  DEFAULT_SETTINGS,
  INSIGHTS,
  INTELLIGENCE_TREND,
  KPI_CARDS,
  MODEL_ACCURACY,
  REPORTS,
} from '@/data/mockData';
import type {
  AIModelCard,
  AutomationItem,
  ConnectedDataSource,
  InsightRow,
  ReportItem,
  SettingsState,
} from '@/types';

// In-memory "database" — module-level so mutations persist across calls for
// the lifetime of the page (a real API would persist server-side instead).
let dataSourcesDb = [...DATA_SOURCES];
let aiModelsDb = [...AI_MODELS];
let automationsDb = [...AUTOMATIONS];
let reportsDb = [...REPORTS];

function delay<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export interface OverviewData {
  kpiCards: typeof KPI_CARDS;
  intelligenceTrend: typeof INTELLIGENCE_TREND;
  dataProcessing: typeof DATA_PROCESSING_BY_SOURCE;
  modelAccuracy: typeof MODEL_ACCURACY;
  activityTable: typeof ACTIVITY_TABLE;
  activityFeed: typeof ACTIVITY_FEED;
}

export async function getOverviewData(): Promise<OverviewData> {
  return delay({
    kpiCards: KPI_CARDS,
    intelligenceTrend: INTELLIGENCE_TREND,
    dataProcessing: DATA_PROCESSING_BY_SOURCE,
    modelAccuracy: MODEL_ACCURACY,
    activityTable: ACTIVITY_TABLE,
    activityFeed: ACTIVITY_FEED,
  });
}

export async function getDataSources(): Promise<ConnectedDataSource[]> {
  return delay([...dataSourcesDb]);
}

export async function connectDataSource(name: string): Promise<ConnectedDataSource> {
  const newSource: ConnectedDataSource = {
    id: `src-${Date.now()}`,
    name,
    status: 'syncing',
    lastSync: 'syncing now',
    recordsProcessed: '0',
    confidence: 0,
  };
  dataSourcesDb = [newSource, ...dataSourcesDb];
  return delay(newSource, 700);
}

export async function syncDataSource(id: string): Promise<ConnectedDataSource | null> {
  dataSourcesDb = dataSourcesDb.map((source) =>
    source.id === id
      ? { ...source, status: 'active', lastSync: 'just now' }
      : source,
  );
  const updated = dataSourcesDb.find((source) => source.id === id) ?? null;
  return delay(updated, 900);
}

export async function getAIModels(): Promise<AIModelCard[]> {
  return delay([...aiModelsDb]);
}

export async function setActiveAIModel(id: string): Promise<AIModelCard[]> {
  aiModelsDb = aiModelsDb.map((model) => ({
    ...model,
    status: model.id === id ? 'active' : 'available',
  }));
  return delay([...aiModelsDb], 400);
}

export async function getInsights(): Promise<InsightRow[]> {
  return delay([...INSIGHTS]);
}

export async function getAutomations(): Promise<AutomationItem[]> {
  return delay([...automationsDb]);
}

export async function runAutomation(id: string): Promise<AutomationItem[]> {
  automationsDb = automationsDb.map((automation) =>
    automation.id === id ? { ...automation, status: 'running' } : automation,
  );
  return delay([...automationsDb], 500);
}

export async function pauseAutomation(id: string): Promise<AutomationItem[]> {
  automationsDb = automationsDb.map((automation) =>
    automation.id === id ? { ...automation, status: 'paused' } : automation,
  );
  return delay([...automationsDb], 500);
}

export async function getReports(): Promise<ReportItem[]> {
  return delay([...reportsDb]);
}

export async function generateReport(name: string): Promise<ReportItem> {
  const newReport: ReportItem = {
    id: `rep-${Date.now()}`,
    name,
    generatedAt: 'just now',
    status: 'ready',
  };
  reportsDb = [newReport, ...reportsDb];
  return delay(newReport, 1100);
}

export async function getSettings(): Promise<SettingsState> {
  return delay({ ...DEFAULT_SETTINGS });
}

export async function updateSettings(settings: SettingsState): Promise<SettingsState> {
  return delay({ ...settings }, 500);
}
