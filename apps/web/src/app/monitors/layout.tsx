import { MonitorLayout } from '@/src/modules/monitors/ui/layout';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div>
      <MonitorLayout>{children}</MonitorLayout>
    </div>
  );
};
export default Layout;
