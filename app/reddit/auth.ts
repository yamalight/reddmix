import { redditAuth } from '~/cookies';

export const generateLoginUrl = () => {
  const loginUrl = `https://www.reddit.com/api/v1/authorize?client_id=${
    process.env.REDDIT_CLIENT_ID
  }&response_type=code&state=${Date.now()}&redirect_uri=${
    process.env.REDDIT_REDIRECT_URI
  }&duration=permanent&scope=read,identity,vote,save`;
  return loginUrl;
};

export type RedditAuthData = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token: string;
};

export const getAuthData = async (
  request: Request
): Promise<RedditAuthData> => {
  let cookieHeader = request.headers.get('Cookie');
  let authData = (await redditAuth.parse(cookieHeader)) as RedditAuthData;
  return authData;
};

export const codeToToken = async (code: string): Promise<RedditAuthData> => {
  const result = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        process.env.REDDIT_CLIENT_ID + ':' + process.env.REDDIT_CLIENT_SECRET
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${process.env.REDDIT_REDIRECT_URI}`,
  }).then((res) => res.json());

  return result;
};

export const refreshToken = async (
  authData: RedditAuthData
): Promise<RedditAuthData> => {
  const result = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        process.env.REDDIT_CLIENT_ID + ':' + process.env.REDDIT_CLIENT_SECRET
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=refresh_token&refresh_token=${authData.refresh_token}`,
  }).then((res) => res.json());

  const newToken = {
    ...authData,
    ...result,
  };

  return newToken;
};

export const executeWithTokenRefresh = async (
  fn: (authData: RedditAuthData) => Promise<any>,
  request: Request
) => {
  let authData = await getAuthData(request);
  if (!authData?.access_token) {
    return false;
  }

  try {
    const frontpage = await fn(authData);
    return { data: frontpage, options: {} };
  } catch (error) {
    if (error.status !== 401) {
      return { error };
    }

    // If the access token is invalid, we need to generate a new one.
    authData = await refreshToken(authData);
    const frontpage = await fn(authData);
    return {
      data: frontpage,
      options: {
        headers: {
          'Set-Cookie': await redditAuth.serialize(authData),
        },
      },
    };
  }
};
