import { Sidebar, SidebarContent } from '@repo/ui/components/sidebar';
import { Separator } from '@repo/ui/components/separator';
import { MainSection } from './main-section';

export const MonitorSidebar = () => {
  return (
    <Sidebar className="z-40 border-r pt-16" collapsible="icon">
      <SidebarContent className="bg-background">
        <MainSection />
        <Separator />
      </SidebarContent>
    </Sidebar>
  );
};
