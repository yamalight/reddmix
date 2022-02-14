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
    (afterToken?.length ?? 0) > 0
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

export const getSubFeed = async ({
  authData,
  subreddit = 'all',
}: {
  authData?: RedditAuthData;
  subreddit?: string;
} = {}) => {
  let result;
  if (authData?.access_token) {
    result = await fetch(`https://oauth.reddit.com/r/${subreddit}/.json`, {
      headers: {
        Authorization: `Bearer ${authData.access_token}`,
      },
    });
  } else {
    result = await fetch(`https://www.reddit.com/r/${subreddit}/.json`);
  }

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
  authData,
  subreddit,
  after,
}: {
  authData?: RedditAuthData;
  subreddit: string;
  after: string;
}) => {
  let result;

  if (authData?.access_token) {
    result = await fetch(
      `https://oauth.reddit.com/r/${subreddit}/.json?after=${after}`,
      {
        headers: {
          Authorization: `Bearer ${authData.access_token}`,
        },
      }
    );
  } else {
    result = await fetch(
      `https://www.reddit.com/r/${subreddit}/.json?after=${after}`
    );
  }

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
  authData,
  subreddit,
  postid,
  postname,
  sort = 'best',
}: {
  authData?: RedditAuthData;
  subreddit: string;
  postid: string;
  postname: string;
  sort: string;
}) => {
  let result;

  if (authData?.access_token) {
    result = await fetch(
      `https://oauth.reddit.com/r/${subreddit}/comments/${postid}/${postname}/.json?sort=${sort}`,
      {
        headers: {
          Authorization: `Bearer ${authData.access_token}`,
        },
      }
    );
  } else {
    result = await fetch(
      `https://www.reddit.com/r/${subreddit}/comments/${postid}/${postname}/.json?sort=${sort}`
    );
  }

  if (result.status !== 200) {
    console.error(result);
    const error = new RedditError('Failed to fetch post info');
    error.status = result.status;
    throw error;
  }

  const json = await result.json();
  const [post, comments] = json;
  const postInfo = post?.data.children[0]?.data;
  const allComments = comments?.data?.children
    .filter((comment) => comment.kind !== 'more')
    .map((comment) => comment.data);
  const more = comments?.data?.children.find(
    (comment) => comment.kind === 'more'
  )?.data;

  return { post: postInfo, comments: allComments, more };
};

export const getMoreComments = async ({
  authData,
  postId,
  children,
  sort = 'best',
}: {
  authData: RedditAuthData;
  postId: string;
  children: string;
  sort?: string;
}) => {
  const linkId = `t3_${postId}`; // This is the post id of the original request, the t3_ prefix signifies post

  const result = await fetch(
    `https://oauth.reddit.com/api/morechildren?link_id=${linkId}&children=${children}&sort=${sort}&api_type=json`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authData.access_token}`,
      },
    }
  );
  if (result.status !== 200) {
    console.error(result);
    const error = new RedditError('Failed to fetch post info');
    error.status = result.status;
    throw error;
  }
  const json = await result.json();
  if (json.json.error) {
    throw new Error(json.json.error);
  }
  const allComments = json.json.data?.things?.map((comment) => comment.data);

  return allComments;
};

export const voteItem = async ({
  authData,
  itemId,
  direction = 1,
}: {
  authData: RedditAuthData;
  itemId: string;
  direction: number;
}) => {
  const result = await fetch(`https://oauth.reddit.com/api/vote`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authData.access_token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `id=${itemId}&dir=${direction}`,
  });
  if (result.status !== 200) {
    console.error(result);
    const error = new RedditError('Failed to upvote item');
    error.status = result.status;
    throw error;
  }
  const json = await result.json();
  if (json.json?.error) {
    throw new Error(json.json.error);
  }
  return json;
};
