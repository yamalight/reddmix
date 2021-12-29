import { useEffect, useMemo, useState } from 'react';
import { json, LoaderFunction, MetaFunction, useLoaderData } from 'remix';
import Comment from '~/components/comment/index.js';
import Header from '~/components/header.js';
import Post from '~/components/post/index.js';
import {
  executeWithTokenRefresh,
  generateLoginUrl,
  getAuthData,
} from '~/reddit/auth.js';
import { getPost } from '~/reddit/client.js';

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = async ({ request, params }) => {
  const authData = await getAuthData(request);
  const { subreddit, postid, postname } = params;
  const loginUrl = authData ? undefined : generateLoginUrl();
  const result = await executeWithTokenRefresh(
    (authData) => getPost({ authData, subreddit, postid, postname }),
    request
  );
  if (result) {
    const { error, data, options } = result;
    if (error) {
      return { error };
    }
    return json({ loginUrl, subreddit, ...data }, options);
  }

  return { error: 'Error fetching post!' };
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = ({ params }) => {
  return {
    title: `Reddmix - ${params.subreddit}`,
    description: 'Welcome to Reddmix!',
  };
};

// https://remix.run/guides/routing#index-routes
export default function PostPage() {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [more, setMore] = useState([]);
  const {
    loginUrl,
    subreddit,
    post,
    comments: baseComments,
    more: baseMore,
  } = useLoaderData();
  const opName = useMemo(() => post.author, [post]);

  useEffect(() => {
    if (comments.length) {
      return;
    }
    setComments(baseComments);
    setMore(baseMore?.children ?? []);
  }, [baseComments, baseMore]);

  const loadMore = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    // get next 100 comments
    const children = more.slice(0, 100).join(',');
    // remove them from more array
    setMore(more.slice(100));

    // request comment data
    const res = await fetch('/api/moreComments', {
      method: 'POST',
      body: JSON.stringify({ postId: post.id, children }),
    }).then((r) => r.json());

    setComments([...comments].concat(res));
    setLoading(false);
  };

  return (
    <>
      <Header loginUrl={loginUrl} subreddit={subreddit} />
      <main className="w-full pt-16">
        <div className="flex justify-center w-full">
          {!post && <div className="text-center">Loading...</div>}
          {post && <Post post={post} expanded />}
        </div>
        <div className="flex flex-col items-center my-8 gap-4 w-full">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} opName={opName} />
          ))}

          {!loginUrl && more.length > 0 && !loading && (
            <button
              className="p-2 px-4 bg-gray-100 rounded my-4"
              onClick={loadMore}
            >
              Load more...
            </button>
          )}
        </div>
      </main>
    </>
  );
}
