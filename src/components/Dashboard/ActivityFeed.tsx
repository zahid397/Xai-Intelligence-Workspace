'use client';

import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { ACTIVITY_FEED } from '@/data/mockData';

export function ActivityFeed() {
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="mb-4 text-sm font-semibold text-ink-200">Activity Feed</h3>
      <ul className="space-y-4">
        {ACTIVITY_FEED.map((item, index) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className="flex items-start gap-3"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-signal-500/10 text-signal-400">
              <Activity className="h-3 w-3" />
            </span>
            <div>
              <p className="text-sm text-ink-300">{item.text}</p>
              <p className="text-xs text-ink-500">{item.time}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
