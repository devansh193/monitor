'use client';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@repo/ui/components/sidebar';
import { BoltIcon, LogsIcon, SettingsIcon } from 'lucide-react';
import { authClient } from '@/src/auth/client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const items = [
  {
    title: 'Uptime',
    url: '/monitors',
    icon: BoltIcon,
    auth: true,
  },
  {
    title: 'Logs',
    url: '/logs',
    icon: LogsIcon,
    auth: true,
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
                    return (
                      authClient.signIn.social({
                        provider: 'google',
                        callbackURL: `${window.location.origin}/monitors`,
                      }),
                      {
                        error: 'Login redirect failed',
                      }
                    );
                  }
                }}
              >
                <Link href={item.url} className="flex items-center gap-4">
                  <item.icon />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
