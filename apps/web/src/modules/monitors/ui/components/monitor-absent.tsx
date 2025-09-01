import { Button } from '@repo/ui/components/button';
import { Clock5Icon } from 'lucide-react';
import Link from 'next/link';

export const MonitorAbsent = () => {
  return (
    <div className="flex h-54 w-full flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950 px-4 text-center shadow-sm sm:px-6 md:h-64">
      <Clock5Icon className="mb-4 h-6 w-6 text-neutral-600 sm:h-8 sm:w-8" />
      <h2 className="mb-1 text-sm font-semibold text-white md:text-xl">No monitors found</h2>
      <p className="mb-4 text-xs text-neutral-400 sm:text-base md:text-sm">
        You haven&apos;t added any monitors yet.
        <br />
        Click <span className="font-medium text-white">“Add Monitor”</span> to get started.
      </p>
      <Link href="/monitors/new">
        <Button
          size={'sm'}
          variant="secondary"
          className="px-4 py-2 text-xs sm:px-6 sm:py-2.5 sm:text-base md:text-sm"
        >
          Add Monitor
        </Button>
      </Link>
    </div>
  );
};
