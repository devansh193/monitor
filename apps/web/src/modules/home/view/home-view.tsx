'use client';

import { Button } from '@workspace/ui/components/button';
import { authClient } from '@/src/auth/client';
import { useRouter } from 'next/navigation';

export const HomeView = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  if (!session) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl text-black">Logged in as: {session.user.name}</h1>
      <Button
        onClick={() =>
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => router.push('/sign-in'),
            },
          })
        }
      >
        Sign out
      </Button>
    </div>
  );
};
