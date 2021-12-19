import { ActionFunction, json } from 'remix';
import { darkModeCookie } from '~/cookies.js';

export let action: ActionFunction = async ({ request }) => {
  const result = await request.json();
  const isDark = Boolean(result.dark);
  const options = {
    headers: {
      Location: '/',
      'Set-Cookie': await darkModeCookie.serialize(isDark),
    },
  };

  return json({ updated: true }, options);
};
