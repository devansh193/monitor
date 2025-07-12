'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { MonitorAbsent } from './monitor-absent';
import { MonitorCard } from './monitor-card';
import { useTRPC } from '@/src/trpc/client';

export const MonitorContent = () => {
  const trpc = useTRPC();
  const { data: monitors } = useSuspenseQuery(trpc.website.getMany.queryOptions());
  if (monitors.length === 0) {
    return (
      <>
        <MonitorAbsent />
      </>
    );
  } else {
    return (
      <div>
        <MonitorCard />
      </div>
    );
  }
};
