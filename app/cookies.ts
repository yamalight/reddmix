import { createCookie } from 'remix';

export let redditAuth = createCookie('reddit-auth', {
  path: '/',
});

export let darkModeCookie = createCookie('dark-mode', {
  path: '/',
});
