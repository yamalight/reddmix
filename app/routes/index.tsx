import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
  redirect,
  useLoaderData,
} from 'remix';
import Feed from '~/components/feed.js';
import Header from '~/components/header.js';
import { redditAuth } from '~/cookies.js';
import { generateLoginUrl, getAuthData, refreshToken } from '~/reddit/auth.js';
import { getAllFeed, getFrontpage } from '~/reddit/client.js';

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = async ({ request }) => {
  let authData = await getAuthData(request);
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
    title: 'Reddmix - Frontpage',
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
  const { loginUrl, posts, after, isAll } = useLoaderData();

  return (
    <>
      <Header loginUrl={loginUrl} />
      <main className="w-full">
        {isAll && (
          <div className="text-center text-xl font-bold">
            Showing /r/all.
            <br />
            Login to view your frontpage posts.
          </div>
        )}
        <Feed initialPosts={posts} initialAfter={after} />
      </main>
    </>
  );
}
