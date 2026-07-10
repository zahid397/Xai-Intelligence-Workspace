'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Navbar } from '@/components/Navbar/Navbar';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero/Hero';
import { IntelligenceFlow } from '@/components/Flow/IntelligenceFlow';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { AutomationWorkflow } from '@/components/Automation/AutomationWorkflow';
import { IntelligenceCoreSection } from '@/components/IntelligenceCore/IntelligenceCoreSection';
import { ToastProvider } from '@/components/UI/Toast';

export default function Home() {
  const [booted, setBooted] = useState(false);

  return (
    <ToastProvider>
      <AnimatePresence mode="wait">
        {!booted && <LoadingScreen key="loading" onComplete={() => setBooted(true)} />}
      </AnimatePresence>

      {booted && (
        <>
          <Navbar />
          <main>
            <Hero />
            <IntelligenceFlow />
            <Dashboard />
            <AutomationWorkflow />
            <IntelligenceCoreSection />
          </main>
          <Footer />
        </>
      )}
    </ToastProvider>
  );
}
