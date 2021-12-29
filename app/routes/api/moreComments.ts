import { ActionFunction, json } from 'remix';
import { executeWithTokenRefresh, getAuthData } from '~/reddit/auth.js';
import { getMoreComments } from '~/reddit/client.js';

export let action: ActionFunction = async ({ request }) => {
  const exAuthData = await getAuthData(request);
  const body = await request.json();
  const { postId, children } = body;
  if (!exAuthData?.access_token) {
    throw new Error('No access token!');
  }
  const result = await executeWithTokenRefresh(
    (authData) => getMoreComments({ authData, postId, children }),
    request
  );
  if (result) {
    const { error, data, options } = result;
    if (error) {
      return { error };
    }
    return json(data, options);
  }

  // throw if something went wrong
  throw new Error('Error fetching comments!');
};
