import { RedditAuthData } from './auth.js';

export class RedditError extends Error {
  status = 500;

  constructor(message: string) {
    super(message);
  }
}

export const getFrontpage = async (
  authData: RedditAuthData,
  { after: afterToken }: { after?: string } = {}
) => {
  const url =
    afterToken?.length > 0
      ? `https://oauth.reddit.com/?after=${afterToken}`
      : 'https://oauth.reddit.com/';
  const result = await fetch(url, {
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
  const after = json?.data?.after;
  const posts = json?.data?.children?.map((post) => post.data);
  return { posts, after };
};

export const getSubFeed = async (subreddit = 'all') => {
  const result = await fetch(`https://www.reddit.com/r/${subreddit}/.json`);

  if (result.status !== 200) {
    const error = new RedditError('Failed to fetch frontpage');
    error.status = result.status;
    throw error;
  }

  const json = await result.json();
  const after = json?.data?.after;
  const posts = json?.data?.children?.map((post) => post.data);
  return { posts, after };
};

export const getNextFeed = async ({
  subreddit,
  after,
}: {
  subreddit: string;
  after: string;
}) => {
  const result = await fetch(
    `https://www.reddit.com/r/${subreddit}/.json?after=${after}`
  );

  if (result.status !== 200) {
    const error = new RedditError('Failed to fetch frontpage');
    error.status = result.status;
    throw error;
  }

  const json = await result.json();
  const newAfter = json?.data?.after;
  const posts = json?.data?.children?.map((post) => post.data);
  return { posts, after: newAfter };
};

export const getPost = async ({
  subreddit,
  postid,
  postname,
}: {
  subreddit: string;
  postid: string;
  postname: string;
}) => {
  const result = await fetch(
    `https://reddit.com/r/${subreddit}/comments/${postid}/${postname}/.json`
  );

  if (result.status !== 200) {
    const error = new RedditError('Failed to fetch frontpage');
    error.status = result.status;
    throw error;
  }

  const json = await result.json();
  const [post, comments] = json;
  const newAfter = comments?.data?.after;
  const postInfo = post?.data.children[0]?.data;
  const allComments = comments?.data?.children?.map((comment) => comment.data);
  return { post: postInfo, comments: allComments, after: newAfter };
};
