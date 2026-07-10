// Static mock data for the dashboard preview. Content mirrors the approved
// product mockups (KPI figures, activity rows, model names) so the preview
// reads as a real, lived-in workspace rather than generic placeholder data.
import type {
  ActivityItem,
  AIModelCard,
  AutomationItem,
  ChartDataPoint,
  ConnectedDataSource,
  IntelligenceStage,
  InsightRow,
  KpiData,
  ModelAccuracy,
  ReportItem,
  SettingsState,
  SphereStat,
  User,
  WorkflowStep,
} from '@/types';

export const CURRENT_USER: User = {
  id: 'u_alex',
  name: 'Alex Chan',
  initials: 'AC',
  role: 'Workspace Owner',
  workspace: 'Enterprise',
};

export const KPI_CARDS: KpiData[] = [
  { id: 'sources', label: 'Active Data Sources', value: '12,540', delta: '+3 today', trend: 'up', icon: 'Database' },
  { id: 'insights', label: 'Generated Insights', value: '8,240', delta: '+128 today', trend: 'up', icon: 'Sparkles' },
  { id: 'automations', label: 'Automations Running', value: '48', delta: 'All healthy', trend: 'flat', icon: 'Workflow' },
  { id: 'success', label: 'Success Rate', value: '99.2%', delta: '+0.4%', trend: 'up', icon: 'ShieldCheck' },
];

// Intelligence Trend — insights generated, last 24h (hourly, 3h steps)
export const INTELLIGENCE_TREND: ChartDataPoint[] = [
  { label: '00:00', value: 210 },
  { label: '03:00', value: 180 },
  { label: '06:00', value: 260 },
  { label: '09:00', value: 640 },
  { label: '12:00', value: 980 },
  { label: '15:00', value: 1200 },
  { label: '18:00', value: 1640 },
  { label: '21:00', value: 2010 },
  { label: '24:00', value: 2400 },
];

// Data Processing — volume by connected source
export const DATA_PROCESSING_BY_SOURCE: ChartDataPoint[] = [
  { label: 'Salesforce', value: 3120 },
  { label: 'AWS CloudWatch', value: 2480 },
  { label: 'Stripe', value: 1890 },
  { label: 'Linear', value: 1240 },
  { label: 'Segment', value: 980 },
  { label: 'PagerDuty', value: 610 },
];

export const MODEL_ACCURACY: ModelAccuracy[] = [
  { model: 'GPT-4o', confidence: 96 },
  { model: 'Claude 3.5', confidence: 94 },
  { model: 'Gemini', confidence: 87 },
];

// "Recent Intelligence" table — verbatim from the approved mockup
export const ACTIVITY_TABLE: ActivityItem[] = [
  { id: 'a1', source: 'Salesforce CRM', analysis: 'Revenue drop Q4 — 3 accounts at risk', confidence: 96, status: 'critical', time: '2m ago' },
  { id: 'a2', source: 'AWS CloudWatch', analysis: 'Latency spike detected — p99 > 800ms', confidence: 92, status: 'warning', time: '5m ago' },
  { id: 'a3', source: 'Stripe Payments', analysis: 'Churn signal: 12 enterprise subscriptions', confidence: 88, status: 'insight', time: '11m ago' },
  { id: 'a4', source: 'Linear Issues', analysis: 'Velocity decline — sprint 47 at 63% capacity', confidence: 94, status: 'insight', time: '18m ago' },
  { id: 'a5', source: 'Segment Events', analysis: 'Feature adoption spike — AI Reports +340%', confidence: 99, status: 'positive', time: '24m ago' },
  { id: 'a6', source: 'PagerDuty', analysis: '3 incidents correlated — root cause identified', confidence: 92, status: 'resolved', time: '31m ago' },
];

export interface ActivityFeedEntry {
  id: string;
  text: string;
  time: string;
}

export const ACTIVITY_FEED: ActivityFeedEntry[] = [
  { id: 'f1', text: 'New insight generated from Sales DB', time: '2m ago' },
  { id: 'f2', text: "Data source 'CRM' connected", time: '9m ago' },
  { id: 'f3', text: "Automation 'Weekly Report' triggered", time: '17m ago' },
  { id: 'f4', text: '48 AI models synced successfully', time: '32m ago' },
  { id: 'f5', text: "Automation 'Churn Signal → CRM' fired", time: '41m ago' },
];

export const WORKFLOW_STEPS: WorkflowStep[] = [
  { id: 'input', title: 'Data Input', detail: '12,540 sources connected', metric: '98.4% health', status: 'active' },
  { id: 'processing', title: 'AI Processing', detail: '48 models active', metric: '96% confidence', status: 'processing' },
  { id: 'decision', title: 'Decision Engine', detail: 'Rule engine v3', metric: '<12ms latency', status: 'deciding' },
  { id: 'automation', title: 'Automation', detail: 'Actions dispatched', metric: '3,847 fired', status: 'active' },
];

export const AUTOMATIONS: AutomationItem[] = [
  {
    id: 'revenue-alert',
    name: 'Revenue Alert → Slack',
    trigger: 'Revenue drop > 15%',
    action: 'Notify sales team + schedule call',
    runsThisMonth: 847,
    active: true,
    status: 'running',
    badge: 'active',
  },
  {
    id: 'churn-signal',
    name: 'Churn Signal → CRM',
    trigger: 'Enterprise churn probability > 80%',
    action: 'Create Salesforce task + email CSM',
    runsThisMonth: 213,
    active: true,
    status: 'running',
    badge: 'active',
  },
  {
    id: 'latency-spike',
    name: 'Latency Spike → PagerDuty',
    trigger: 'p99 latency > 500ms for 3 min',
    action: 'Page on-call engineer + auto-scale',
    runsThisMonth: 42,
    active: true,
    status: 'running',
    badge: 'active',
  },
  {
    id: 'insight-report',
    name: 'Insight Report → Email',
    trigger: 'Daily at 09:00 UTC',
    action: 'Generate report + send to stakeholders',
    runsThisMonth: 186,
    active: false,
    status: 'paused',
    badge: 'scheduled',
  },
];

export const SPHERE_STATS: SphereStat[] = [
  { label: 'Active Nodes', value: '16' },
  { label: 'Neural Links', value: '48' },
  { label: 'Inferences/s', value: '12K' },
  { label: 'Accuracy', value: '96%' },
  { label: 'Latency', value: '<8ms' },
  { label: 'Uptime', value: '99.9%' },
];
export const INTELLIGENCE_STAGES: IntelligenceStage[] = [
  {
    id: 'ingest',
    index: '01',
    eyebrow: 'INGEST DATA',
    title: 'Ingest Data',
    description: 'Connect CRMs, documents, spreadsheets, APIs, and internal tools.',
    stats: [
      { label: 'sources', value: '12,540' },
      { label: 'uptime', value: '99.9%' },
      { label: 'latency', value: '<50ms' },
    ],
  },
  {
    id: 'analyze',
    index: '02',
    eyebrow: 'ANALYZE WITH AI',
    title: 'Analyze with AI',
    description: 'AI models detect patterns, risks, opportunities, and relationships.',
    stats: [
      { label: 'confidence', value: '96%' },
      { label: 'AI models', value: '48' },
      { label: 'processing', value: 'Real-time' },
    ],
  },
  {
    id: 'insight',
    index: '03',
    eyebrow: 'GENERATE INSIGHT',
    title: 'Generate Insight',
    description: 'Xai turns analysis into clear recommendations and decisions.',
    stats: [
      { label: 'insights/day', value: '8,240' },
      { label: 'faster decisions', value: '4.2x' },
      { label: 'automation', value: 'Auto-actions' },
    ],
  },
  {
    id: 'automation',
    index: '04',
    eyebrow: 'TRIGGER AUTOMATION',
    title: 'Trigger Automation',
    description: 'Approved insights can trigger reports, alerts, workflows, and actions.',
    stats: [
      { label: 'actions fired', value: '3,847' },
      { label: 'automations', value: '48' },
      { label: 'time saved', value: '482h' },
    ],
  },
];

// --- Added for the dashboard-interaction fix pass ---

export const DATA_SOURCES: ConnectedDataSource[] = [
  { id: 'src-crm', name: 'CRM Database', status: 'active', lastSync: '2 min ago', recordsProcessed: '3.1M', confidence: 96 },
  { id: 'src-sheets', name: 'Google Sheets', status: 'active', lastSync: '6 min ago', recordsProcessed: '482K', confidence: 91 },
  { id: 'src-analytics', name: 'Website Analytics', status: 'syncing', lastSync: 'syncing now', recordsProcessed: '2.4M', confidence: 88 },
  { id: 'src-support', name: 'Support Tickets', status: 'active', lastSync: '14 min ago', recordsProcessed: '210K', confidence: 94 },
  { id: 'src-sales', name: 'Sales Database', status: 'failed', lastSync: '2 hours ago', recordsProcessed: '1.2M', confidence: 0 },
];

export const AI_MODELS: AIModelCard[] = [
  { id: 'gpt-4o', name: 'GPT-4o', accuracy: 96, latencyMs: 340, status: 'active', costLevel: 'high' },
  { id: 'claude-3-5', name: 'Claude 3.5', accuracy: 94, latencyMs: 290, status: 'available', costLevel: 'medium' },
  { id: 'gemini', name: 'Gemini', accuracy: 87, latencyMs: 260, status: 'available', costLevel: 'low' },
  { id: 'xai-internal', name: 'Internal Xai Model', accuracy: 91, latencyMs: 80, status: 'available', costLevel: 'low' },
];

export const INSIGHTS: InsightRow[] = [
  { id: 'ins-1', source: 'Salesforce CRM', analysis: 'Revenue drop Q4 — 3 accounts at risk', confidence: 96, status: 'completed', recommendation: 'Schedule executive check-in calls with all 3 accounts this week.', createdAt: '2m ago' },
  { id: 'ins-2', source: 'AWS CloudWatch', analysis: 'Latency spike detected — p99 > 800ms', confidence: 92, status: 'completed', recommendation: 'Scale the checkout service and investigate the slow query path.', createdAt: '5m ago' },
  { id: 'ins-3', source: 'Stripe Payments', analysis: 'Churn signal: 12 enterprise subscriptions', confidence: 88, status: 'processing', recommendation: 'Analysis in progress — recommendation pending.', createdAt: '11m ago' },
  { id: 'ins-4', source: 'Linear Issues', analysis: 'Velocity decline — sprint 47 at 63% capacity', confidence: 94, status: 'completed', recommendation: 'Rebalance sprint scope; 2 blockers are affecting 3 engineers.', createdAt: '18m ago' },
  { id: 'ins-5', source: 'Segment Events', analysis: 'Feature adoption spike — AI Reports +340%', confidence: 99, status: 'completed', recommendation: 'Promote AI Reports in the next release changelog and onboarding flow.', createdAt: '24m ago' },
  { id: 'ins-6', source: 'PagerDuty', analysis: '3 incidents correlated — root cause identified', confidence: 92, status: 'completed', recommendation: 'Patch the shared auth middleware; root cause confirmed across all 3.', createdAt: '31m ago' },
  { id: 'ins-7', source: 'Support Tickets', analysis: 'Rising complaint volume — onboarding flow', confidence: 74, status: 'processing', recommendation: 'Analysis in progress — recommendation pending.', createdAt: '38m ago' },
];

export const REPORTS: ReportItem[] = [
  { id: 'rep-1', name: 'Weekly Intelligence Summary', generatedAt: '2 hours ago', status: 'ready' },
  { id: 'rep-2', name: 'Q4 Revenue Risk Report', generatedAt: '1 day ago', status: 'ready' },
  { id: 'rep-3', name: 'Automation Performance — June', generatedAt: '3 days ago', status: 'ready' },
];

export const DEFAULT_SETTINGS: SettingsState = {
  emailNotifications: true,
  autoSync: true,
  aiRecommendations: true,
  reducedMotion: false,
};
