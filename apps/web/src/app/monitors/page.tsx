import { MonitorView } from '@/src/modules/monitors/ui/views/monitor-view';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient, trpc } from '@/src/trpc/server';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

const Page = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.website.getMany.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<p>Error!</p>}>
        <Suspense fallback={<div>Loading...</div>}>
          <MonitorView />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
};

export default Page;
