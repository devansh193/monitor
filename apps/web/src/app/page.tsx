import { HomeView } from '../modules/home/view/home-view';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import auth from '../auth/server';

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect('/sign-in');
  }
  return <HomeView />;
}
