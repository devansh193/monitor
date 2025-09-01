import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { SearchIcon } from 'lucide-react';
import Link from 'next/link';

export const MonitorHeader = () => {
  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <h1 className="hidden text-xl font-medium md:block">Monitors</h1>
        </div>
        <div className="flex items-center gap-x-2">
          <div className="relative">
            <span className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="size-4" />
            </span>
            <Input placeholder="Search" className="placeholder:text-muted-foreground pl-9" />
          </div>
          <Link href="/monitors/new">
            <Button variant={'secondary'} className="mt-1">
              Add Monitor
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
