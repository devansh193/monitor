'use client';

import { usePathname } from 'next/navigation';

export const usePathSegment = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const getHref = (index: number) => '/' + segments.slice(0, index + 1).join('/');

  return { segments, getHref };
};
