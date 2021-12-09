import { ActionFunction, redirect } from 'remix';
import { getAuthData } from '~/reddit/auth.js';
import { getFrontpage } from '~/reddit/client.js';

export let action: ActionFunction = async ({ request }) => {
  const authData = await getAuthData(request);
  const body = await request.json();
  const after = body.after;
  // const count = body.count;
  if (authData?.access_token) {
    try {
      const frontpage = await getFrontpage(authData, { after });
      return frontpage;
    } catch (error) {
      return redirect('/');
    }
  }

  return redirect('/');
};
