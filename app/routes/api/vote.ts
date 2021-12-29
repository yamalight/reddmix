import { ActionFunction, json } from 'remix';
import { executeWithTokenRefresh, getAuthData } from '~/reddit/auth.js';
import { voteItem } from '~/reddit/client.js';

export let action: ActionFunction = async ({ request }) => {
  const exAuthData = await getAuthData(request);
  const body = await request.json();
  const { itemId, direction } = body;
  if (!exAuthData?.access_token) {
    throw new Error('No access token!');
  }
  const result = await executeWithTokenRefresh(
    (authData) => voteItem({ authData, itemId, direction }),
    request
  );
  if (result) {
    const { error, data, options } = result;
    if (error) {
      throw new Error(error);
    }
    return json(data, options);
  }

  // throw if something went wrong
  throw new Error('Error upvoting item!');
};
