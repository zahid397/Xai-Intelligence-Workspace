'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { INTELLIGENCE_TREND, DATA_PROCESSING_BY_SOURCE, MODEL_ACCURACY } from '@/data/mockData';

const tooltipStyle = {
  backgroundColor: '#0f1430',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#f1f2f8',
  fontSize: '12px',
  padding: '8px 12px',
};

const axisTick = { fill: '#64748B', fontSize: 11 };

function ChartCard({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-ink-200">{title}</h3>
        {caption && <span className="font-mono text-xs text-emerald-400">{caption}</span>}
      </div>
      {children}
    </div>
  );
}

export function IntelligenceTrendChart() {
  return (
    <ChartCard title="Intelligence Trend" caption="+18.4%">
      <p className="-mt-2 mb-3 text-xs text-ink-500">Insights generated — last 24h</p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={INTELLIGENCE_TREND} margin={{ left: -20, right: 8, top: 8 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'rgba(139,92,246,0.3)' }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: '#a78bfa' }}
              isAnimationActive
              animationDuration={900}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function DataProcessingChart() {
  return (
    <ChartCard title="Data Processing" caption="by source">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA_PROCESSING_BY_SOURCE} margin={{ left: -20, right: 8, top: 8 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ ...axisTick, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="value" fill="#06b6d4" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={900} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

const DONUT_COLORS = ['#8b5cf6', '#22d3ee', '#4c1d95'];

export function ModelAccuracyChart() {
  const donutData = MODEL_ACCURACY.map((m) => ({ name: m.model, value: m.confidence }));
  const overallAccuracy = Math.round(
    MODEL_ACCURACY.reduce((sum, m) => sum + m.confidence, 0) / MODEL_ACCURACY.length,
  );

  return (
    <ChartCard title="Model Accuracy" caption="confidence by model">
      <div className="relative h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={donutData}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={78}
              paddingAngle={4}
              isAnimationActive
              animationDuration={900}
            >
              {donutData.map((entry, index) => (
                <Cell key={entry.name} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-semibold text-ink-100">{overallAccuracy}%</span>
          <span className="text-[10px] text-ink-500">avg. confidence</span>
        </div>
      </div>
      <ul className="mt-3 space-y-1.5">
        {MODEL_ACCURACY.map((m, i) => (
          <li key={m.model} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-ink-400">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}
              />
              {m.model}
            </span>
            <span className="font-mono text-ink-300">{m.confidence}%</span>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
