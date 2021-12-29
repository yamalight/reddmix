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
import {
  executeWithTokenRefresh,
  generateLoginUrl,
  getAuthData,
} from '~/reddit/auth.js';
import { getFrontpage, getSubFeed } from '~/reddit/client.js';

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = async ({ request }) => {
  const result = await executeWithTokenRefresh(getFrontpage, request);
  if (result) {
    const { error, data, options } = result;
    if (error) {
      return { error };
    }
    return json(data, options);
  }

  const all = await getSubFeed();
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
  // const authData = await getAuthData(request);
  const formData = await request.formData();
  const after = formData.get('after');
  const count = formData.get('count');
  const result = await executeWithTokenRefresh(
    (authData) => getFrontpage(authData, { after, count }),
    request
  );
  if (result) {
    const { error, data, options } = result;
    if (error) {
      return { error };
    }
    return json(data, options);
  }

  return { error: 'Not logged in' };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const { loginUrl, posts, after, isAll } = useLoaderData();

  return (
    <>
      <Header loginUrl={loginUrl} />
      <main className="w-full pt-16">
        {isAll && (
          <div className="text-center text-xl font-bold dark:text-gray-400">
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
