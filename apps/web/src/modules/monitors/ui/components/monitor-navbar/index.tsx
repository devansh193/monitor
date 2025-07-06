import { SidebarTrigger } from '@repo/ui/components/sidebar';
import Link from 'next/link';

export const MonitorNavbar = () => {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center border-b px-2 pr-5">
      <div className="flex w-full items-center gap-4">
        <div className="flex flex-shrink-0 items-center">
          <SidebarTrigger />
          <Link href={'/'} className="hidden md:block">
            <div className="ml-4 flex items-center gap-4 p-1">
              <p className="text-lg font-medium tracking-wide">Monitor</p>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};
