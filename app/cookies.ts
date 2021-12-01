import { createCookie } from 'remix';

export let redditAuth = createCookie('reddit-auth', {
  path: '/',
});
