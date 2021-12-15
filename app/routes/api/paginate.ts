import { ActionFunction, redirect } from 'remix';
import { getAuthData } from '~/reddit/auth.js';
import { getFrontpage, getNextFeed } from '~/reddit/client.js';

export let action: ActionFunction = async ({ request }) => {
  const authData = await getAuthData(request);
  const body = await request.json();
  const { after, subreddit } = body;
  // const count = body.count;
  if (authData?.access_token && !subreddit?.length) {
    try {
      const frontpage = await getFrontpage(authData, { after });
      return frontpage;
    } catch (error) {
      return redirect('/');
    }
  }

  if (subreddit?.length) {
    try {
      const feed = await getNextFeed({ authData, subreddit, after });
      return feed;
    } catch (error) {
      return redirect('/');
    }
  }

  return redirect('/');
};
