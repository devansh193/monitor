'use client';
import { Button } from '@workspace/ui/components/button';
import { authClient } from '@/src/auth/client';
import { FcGoogle } from 'react-icons/fc';
export const SignInView = () => {
  const handleLoginWithGoogle = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/',
    });
  };
  return (
    <div className="grid h-screen grid-cols-1 bg-gray-100 lg:grid-cols-2">
      <div className="col-span-1 bg-[#151517]">
        <div className="flex h-full flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center justify-center">
              <h1 className="font-sans text-4xl font-semibold text-neutral-100">Welcome back!</h1>
              <p className="text-neutral-400">Sign in to continue to your account</p>
            </div>
            <Button
              className="w-[350px] rounded-lg border border-black bg-[#262628] py-5 inset-shadow-sm inset-shadow-[#4B4B4D]/80 hover:bg-[#272729]/80 hover:inset-shadow-[#4B4B4D]/40 active:translate-x-px active:scale-[0.99] active:shadow-inner"
              type="button"
              onClick={handleLoginWithGoogle}
            >
              <FcGoogle /> Sign in with Google
            </Button>
            <div className="text-center">
              <p className="text-xs text-neutral-500">
                By signing in, you agree to our{' '}
                <a href="#" className="text-neutral-400 underline hover:text-white">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-neutral-400 underline hover:text-white">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="relative hidden h-screen w-full lg:col-span-1 lg:block"
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1 className="font-geist absolute bottom-6 left-1/2 -translate-x-1/2 transform text-xs font-medium tracking-wider text-[#838383]">
          because i love mountains.
        </h1>
      </div>
    </div>
  );
};
