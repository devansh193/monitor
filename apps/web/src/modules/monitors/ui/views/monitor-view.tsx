import { LoadingScreen } from '@/src/modules/home/components/loading-screen';
import { MonitorContent } from '../components/monitor-content';
import { MonitorHeader } from '../components/monitor-header';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

export const MonitorView = () => {
  return (
    <div className="mx-auto mb-10 flex max-w-[2400px] flex-col gap-y-6 px-4 pt-2.5">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-y-6">
        <MonitorHeader />
        <ErrorBoundary fallback={<MonitorError />}>
          <Suspense fallback={<LoadingScreen />}>
            <MonitorContent />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export const MonitorError = () => (
  <div className="flex flex-col items-center justify-center py-10">
    <h2 className="text-2xl font-bold text-red-500/50">Something went wrong</h2>
    <p className="mb-4 text-neutral-700">Error loading monitors</p>
  </div>
);
