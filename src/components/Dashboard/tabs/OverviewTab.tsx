import { KpiCards } from '../KpiCards';
import { DataProcessingChart, IntelligenceTrendChart, ModelAccuracyChart } from '../Charts';
import { ActivityTable } from '../ActivityTable';
import { ActivityFeed } from '../ActivityFeed';

/**
 * The original dashboard content, now living inside the "Overview" tab
 * instead of being the dashboard's only view. KpiCards/Charts/ActivityTable
 * still read their own data directly (they were already correct) — this
 * tab's job is just composition and layout.
 */
export function OverviewTab() {
  return (
    <div className="space-y-4">
      <KpiCards />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <IntelligenceTrendChart />
        </div>
        <ModelAccuracyChart />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataProcessingChart />
        </div>
        <ActivityFeed />
      </div>

      <ActivityTable />
    </div>
  );
}
