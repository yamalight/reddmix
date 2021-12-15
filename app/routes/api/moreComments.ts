import { ActionFunction } from 'remix';
import { getAuthData } from '~/reddit/auth.js';
import { getMoreComments } from '~/reddit/client.js';

export let action: ActionFunction = async ({ request }) => {
  const authData = await getAuthData(request);
  const body = await request.json();
  const { postId, children } = body;
  if (!authData?.access_token) {
    throw new Error('No access token!');
  }

  const comments = await getMoreComments({ authData, postId, children });
  return comments;
};
