import { ActionFunction, json } from 'remix';
import { darkModeCookie, redditAuth } from '~/cookies.js';

export let action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get('Cookie');
  const darkData = await darkModeCookie.parse(cookieHeader);
  const options = {
    headers: [
      ['Set-Cookie', await darkModeCookie.serialize(darkData)],
      ['Set-Cookie', await redditAuth.serialize('deleted')],
    ],
  };

  return json({ updated: true }, options);
};
