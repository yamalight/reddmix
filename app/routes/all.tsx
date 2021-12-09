import { LoaderFunction, MetaFunction, useLoaderData } from 'remix';
import Feed from '~/components/feed.js';
import Header from '~/components/header.js';
import { generateLoginUrl, getAuthData } from '~/reddit/auth.js';
import { getAllFeed } from '~/reddit/client.js';

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = async ({ request }) => {
  const authData = await getAuthData(request);
  const feed = await getAllFeed();
  const loginUrl = authData ? undefined : generateLoginUrl();
  return { loginUrl, ...feed };
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: 'Reddmix - All',
    description: 'Welcome to Reddmix!',
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const { loginUrl, posts, after } = useLoaderData();

  return (
    <>
      <Header loginUrl={loginUrl} />
      <main className="w-full">
        {!posts && (
          <div className="text-center text-2xl font-bold">
            Could not fetch all reddit posts.
          </div>
        )}
        <Feed initialPosts={posts} initialAfter={after} subreddit="all" />
      </main>
    </>
  );
}
