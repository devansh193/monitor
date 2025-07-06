'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Badge } from '@workspace/ui/components/badge';
import { useMutation } from '@tanstack/react-query';
import { authClient } from '@/src/auth/client';
import { useTRPC } from '@/src/trpc/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const HomeView = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [inputMessage, setInputMessage] = useState('Hello from client');
  const [result, setResult] = useState<string>('');

  const helloMutation = useMutation(
    trpc.hello.hello.mutationOptions({
      onSuccess: (data) => {
        setResult(data.message);
      },
      onError: (error) => {
        setResult(`Error: ${error.message}`);
      },
    }),
  );

  const handleSendMessage = () => {
    helloMutation.mutate({ message: inputMessage });
  };

  if (sessionLoading || !trpc) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push('/sign-in');
    return null;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold">Welcome to Monitor</h1>
          <p className="text-neutral-400">Your website monitoring dashboard</p>
        </div>

        {/* User Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">Logged in</Badge>
              {session.user.name}
            </CardTitle>
            <CardDescription>Email: {session.user.email}</CardDescription>
          </CardHeader>
        </Card>

        {/* TRPC Test Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>API Connection Test</CardTitle>
            <CardDescription>Test the connection to the backend API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Enter a message"
              />
              <Button onClick={handleSendMessage} disabled={helloMutation.isPending}>
                {helloMutation.isPending ? 'Sending...' : 'Send Message'}
              </Button>
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
            {result && (
              <div className="mt-4 rounded-md bg-gray-50 p-3">
                <p className="text-sm text-gray-700">{result}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
