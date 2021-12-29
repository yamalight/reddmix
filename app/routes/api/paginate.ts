import { ActionFunction, json, redirect } from 'remix';
import { executeWithTokenRefresh, getAuthData } from '~/reddit/auth.js';
import { getFrontpage, getNextFeed } from '~/reddit/client.js';

export let action: ActionFunction = async ({ request }) => {
  const authData = await getAuthData(request);
  const body = await request.json();
  const { after, subreddit } = body;
  // const count = body.count;
  if (authData?.access_token && !subreddit?.length) {
    const result = await executeWithTokenRefresh(
      (authData) => getFrontpage(authData, { after }),
      request
    );
    if (result) {
      const { error, data, options } = result;
      if (error) {
        throw new Error(error);
      }
      return json(data, options);
    }

    throw new Error('Error fetching subreddit!');
  }

  if (subreddit?.length) {
    const result = await executeWithTokenRefresh(
      (authData) => getNextFeed({ authData, subreddit, after }),
      request
    );
    if (result) {
      const { error, data, options } = result;
      if (error) {
        throw new Error(error);
      }
      return json(data, options);
    }
  }

  return redirect('/');
};
