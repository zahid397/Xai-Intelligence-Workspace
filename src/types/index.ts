// Shared domain types for the Xai Intelligence Workspace.
//
// Note: adapted the requested type list to what this product actually models.
// "Order / Product / Payment" don't apply to an AI intelligence workspace —
// swapped for DataSource / Automation / WorkflowStep, which the dashboard and
// automation sections genuinely use. Everything below is imported somewhere.

export interface User {
  id: string;
  name: string;
  initials: string;
  role: string;
  workspace: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface KpiData {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'flat';
  icon: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export type ActivityStatus = 'critical' | 'warning' | 'insight' | 'positive' | 'resolved';

export interface ActivityItem {
  id: string;
  source: string;
  analysis: string;
  confidence: number;
  status: ActivityStatus;
  time: string;
}

export interface ModelAccuracy {
  model: string;
  confidence: number;
}

export interface DataSourceStat {
  label: string;
  value: string;
}

export interface IntelligenceStage {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  stats: DataSourceStat[];
}

export interface WorkflowStep {
  id: string;
  title: string;
  detail: string;
  metric: string;
  status: string;
}

export interface AutomationItem {
  id: string;
  name: string;
  trigger: string;
  action: string;
  runsThisMonth: number;
  active: boolean;
  status: 'running' | 'paused';
  // Display-only badge shown on the landing showcase (e.g. "active",
  // "scheduled"). The dashboard tab uses `status` for its Run/Pause logic;
  // this is purely the label the marketing section renders.
  badge: 'active' | 'scheduled';
}

export interface SphereStat {
  label: string;
  value: string;
}

// --- Added for the dashboard-interaction fix pass ---

export type DashboardTabId =
  | 'overview'
  | 'sources'
  | 'models'
  | 'insights'
  | 'automations'
  | 'reports'
  | 'settings';

export type DataSourceStatus = 'active' | 'syncing' | 'failed';

export interface ConnectedDataSource {
  id: string;
  name: string;
  status: DataSourceStatus;
  lastSync: string;
  recordsProcessed: string;
  confidence: number;
}

export type AIModelStatusValue = 'active' | 'available';
export type CostLevel = 'low' | 'medium' | 'high';

export interface AIModelCard {
  id: string;
  name: string;
  accuracy: number;
  latencyMs: number;
  status: AIModelStatusValue;
  costLevel: CostLevel;
}

export type InsightStatus = 'completed' | 'processing';

export interface InsightRow {
  id: string;
  source: string;
  analysis: string;
  confidence: number;
  status: InsightStatus;
  recommendation: string;
  createdAt: string;
}

export type AutomationRunStatus = 'running' | 'paused';

export type ReportStatus = 'ready' | 'generating';

export interface ReportItem {
  id: string;
  name: string;
  generatedAt: string;
  status: ReportStatus;
}

export interface SettingsState {
  emailNotifications: boolean;
  autoSync: boolean;
  aiRecommendations: boolean;
  reducedMotion: boolean;
}

export type ToastVariant = 'success' | 'info' | 'error';

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
}
