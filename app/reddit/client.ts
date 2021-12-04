import { RedditAuthData } from './auth.js';

export class RedditError extends Error {
  status = 500;

  constructor(message: string) {
    super(message);
  }
}

export const getFrontpage = async (authData: RedditAuthData) => {
  const result = await fetch('https://oauth.reddit.com/', {
    headers: {
      Authorization: `Bearer ${authData.access_token}`,
    },
  });

  if (result.status !== 200) {
    const error = new RedditError('Failed to fetch frontpage');
    error.status = result.status;
    throw error;
  }

  const json = await result.json();
  const posts = json?.data?.children?.map((post) => post.data);
  return posts;
};
