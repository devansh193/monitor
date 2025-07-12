'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@repo/ui/components/sidebar';
import {
  LogsIcon,
  SettingsIcon,
  ChartNoAxesColumnIncreasingIcon,
  ActivityIcon,
} from 'lucide-react';
import { authClient } from '@/src/auth/client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const items = [
  {
    title: 'Monitors',
    url: '/monitors',
    icon: ActivityIcon,
    auth: true,
  },
  {
    title: 'Logs',
    url: '/logs',
    icon: LogsIcon,
    auth: true,
  },
  {
    title: 'Analytics',
    url: '/analytics',
    icon: ChartNoAxesColumnIncreasingIcon,
    auth: false,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: SettingsIcon,
    auth: false,
  },
];

export const MainSection = () => {
  const pathname = usePathname();
  const session = authClient.getSession();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={pathname === item.url}
                onClick={(e) => {
                  if (!session && item.auth) {
                    e.preventDefault();
                    authClient.signIn.social({
                      provider: 'google',
                      callbackURL: `${window.location.origin}/monitors`,
                    });
                  }
                }}
                className="hover:bg-muted w-full rounded-md px-3 py-2 transition"
              >
                <Link href={item.url} className="flex w-full items-center gap-2 text-sm">
                  <item.icon className="text-muted-foreground h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
