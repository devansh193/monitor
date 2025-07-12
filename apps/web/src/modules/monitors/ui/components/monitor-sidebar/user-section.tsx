'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { EllipsisVerticalIcon, UserIcon } from 'lucide-react';
import { useSidebar } from '@repo/ui/components/sidebar';
import { useSession } from '@/src/auth/client';
import { cn } from '@workspace/ui/lib/utils';

export const UserSection = () => {
  const { data: session } = useSession();
  const { open } = useSidebar();

  return (
    <div
      className={cn(
        `sm:gap-3" m-2 flex items-center gap-2 rounded-lg py-2 pr-3 hover:cursor-pointer`,
        open && 'pl-2 hover:bg-[#262626]',
      )}
    >
      {session?.user.image ? (
        <Avatar className="ml-auto h-8 w-8 sm:h-9 sm:w-9">
          <AvatarImage src={session.user.image} alt={session.user.name} />
          <AvatarFallback className="pt-[1px] text-xs sm:text-sm">
            {session.user.name
              ?.split(' ')
              .map((word) => word.charAt(0))
              .slice(0, 2)
              .join('')}
          </AvatarFallback>
        </Avatar>
      ) : (
        <UserIcon className="text-muted-foreground h-8 w-8 sm:h-9 sm:w-9" />
      )}

      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium sm:text-base">{session?.user.name}</span>
        <span className="text-muted-foreground truncate text-xs sm:text-sm">
          {session?.user.email}
        </span>
      </div>

      <div className="ml-auto flex items-center justify-center">
        <EllipsisVerticalIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
    </div>
  );
};
