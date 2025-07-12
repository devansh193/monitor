'use client';
import { Sidebar, SidebarContent, useSidebar } from '@repo/ui/components/sidebar';
import { UserSection } from './user-section';
import { MainSection } from './main-section';

const NAME = 'Acme inc.';
export const MonitorSidebar = () => {
  const { open } = useSidebar();
  return (
    <Sidebar className="z-40 border-none! pt-2" collapsible="icon">
      <SidebarContent className="flex flex-col justify-between">
        <div className="flex flex-col">
          <h1 className="flex gap-x-2 px-4 py-4 text-lg font-medium text-neutral-100 hover:cursor-pointer">
            {open ? NAME : NAME.slice(0, 2)}
          </h1>
          <MainSection />
        </div>
        <UserSection />
      </SidebarContent>
    </Sidebar>
  );
};
