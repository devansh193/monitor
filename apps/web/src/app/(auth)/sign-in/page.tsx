import { SignInView } from '@/src/modules/auth/views/sign-in-view';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import auth from '@/src/auth/server';

const SignInPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!!session) {
    redirect('/');
  }
  return <SignInView />;
};
export default SignInPage;
