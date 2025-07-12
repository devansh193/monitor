'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@repo/ui/components/breadcrumb';
import { SidebarTrigger } from '@repo/ui/components/sidebar';
import { usePathSegment } from '@/src/hooks/usePathSegment';

import React from 'react';

export const MonitorNavbar = () => {
  const { segments, getHref } = usePathSegment();

  return (
    <nav className="z-50 flex h-14 items-center border-b px-2 pt-[4px] pr-5">
      <div className="flex w-full items-center gap-4">
        <div className="flex flex-shrink-0 items-center gap-x-4">
          <SidebarTrigger />
          <div className="hidden h-4 w-[0.5px] bg-neutral-500 pt-[2px] md:block" />
          <div className="hidden md:block">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {segments.map((segment, idx) => (
                  <React.Fragment key={idx}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {idx === segments.length - 1 ? (
                        <BreadcrumbPage>
                          {decodeURIComponent(segment)
                            .replace(/-/g, ' ')
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={getHref(idx)}>
                          {decodeURIComponent(segment)
                            .replace(/-/g, ' ')
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </div>
    </nav>
  );
};
