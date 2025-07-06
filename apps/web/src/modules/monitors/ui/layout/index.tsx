import { MonitorSidebar } from '../components/monitor-sidebar';
import { SidebarProvider } from '@repo/ui/components/sidebar';
import { MonitorNavbar } from '../components/monitor-navbar';
interface Props {
  children: React.ReactNode;
}
export const MonitorLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <MonitorNavbar />
        <div className="flex min-h-screen pt-[4rem]">
          <MonitorSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
