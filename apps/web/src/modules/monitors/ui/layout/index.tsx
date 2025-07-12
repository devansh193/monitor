import { MonitorSidebar } from '../components/monitor-sidebar';
import { SidebarProvider } from '@repo/ui/components/sidebar';
import { MonitorNavbar } from '../components/monitor-navbar';

interface Props {
  children: React.ReactNode;
}
export const MonitorLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <div className="bg-sidebar w-full">
        <div className="flex min-h-screen">
          <MonitorSidebar />
          <main className="bg-background m-2 flex-1 overflow-y-auto rounded-xl">
            <MonitorNavbar />
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
