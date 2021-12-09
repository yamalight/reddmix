import { useEffect, useRef, useState } from 'react';
import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
  redirect,
  useLoaderData,
} from 'remix';
import Header from '~/components/header.js';
import Post from '~/components/post/index.js';
import { redditAuth } from '~/cookies.js';
import { useIntersectionObserver } from '~/hooks/useIntersectionObserver.js';
import { generateLoginUrl, getAuthData, refreshToken } from '~/reddit/auth.js';
import { getAllFeed, getFrontpage } from '~/reddit/client.js';

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = async ({ request }) => {
  let authData = await getAuthData(request);
  console.log('loader loading things');
  if (authData?.access_token) {
    try {
      const frontpage = await getFrontpage(authData);
      return frontpage;
    } catch (error) {
      if (error.status !== 401) {
        return { error };
      }

      // If the access token is invalid, we need to generate a new one.
      authData = await refreshToken(authData);
      const frontpage = await getFrontpage(authData);
      return json(frontpage, {
        headers: {
          'Set-Cookie': await redditAuth.serialize(authData),
        },
      });
    }
  }

  const all = await getAllFeed();
  const loginUrl = generateLoginUrl();
  return { loginUrl, ...all, isAll: true };
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: 'Reddmix',
    description: 'Welcome to Reddmix!',
  };
};

export let action: ActionFunction = async ({ request }) => {
  const authData = await getAuthData(request);
  const formData = await request.formData();
  const after = formData.get('after');
  const count = formData.get('count');
  if (authData?.access_token) {
    try {
      const frontpage = await getFrontpage(authData, { after, count });
      return frontpage;
    } catch (error) {
      return redirect('/');
    }
  }

  return redirect('/');
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const loadMoreRef = useRef();
  const [posts, setPosts] = useState([]);
  const [after, setAfter] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    loginUrl,
    posts: loaderPosts,
    after: loaderAfter,
    isAll,
  } = useLoaderData();

  useEffect(() => {
    setPosts(loaderPosts);
    setAfter(loaderAfter);
  }, [loaderPosts, loaderAfter]);

  const loadMore = async (isIntersecting: boolean) => {
    if (!isIntersecting || loading) {
      return;
    }

    setLoading(true);

    const res = await fetch('/api/paginate', {
      method: 'POST',
      body: JSON.stringify({ after }),
    }).then((r) => r.json());

    setPosts([...posts].concat(res.posts));
    setAfter(res.after);
    setLoading(false);
  };

  useIntersectionObserver(loadMoreRef, loadMore, {
    rootMargin: '0px',
  });

  return (
    <>
      <Header loginUrl={loginUrl} />
      <main className="container">
        {isAll && (
          <div className="text-center text-xl font-bold">
            Showing /r/all.
            <br />
            Login to view your frontpage posts.
          </div>
        )}
        {posts && (
          <div className="flex flex-col p-4 gap-8">
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
            {loading && <div>Loading..</div>}
            {!loading && after && (
              <button ref={loadMoreRef} type="submit" onClick={loadMore}>
                Load more
              </button>
            )}
          </div>
        )}
      </main>
    </>
  );
}
