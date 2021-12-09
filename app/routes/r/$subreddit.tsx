import { LoaderFunction, MetaFunction, useLoaderData } from 'remix';
import Feed from '~/components/feed.js';
import Header from '~/components/header.js';
import { generateLoginUrl, getAuthData } from '~/reddit/auth.js';
import { getSubFeed } from '~/reddit/client.js';

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = async ({ request, params }) => {
  const authData = await getAuthData(request);
  const subreddit = params.subreddit;
  const feed = await getSubFeed(subreddit);
  const loginUrl = authData ? undefined : generateLoginUrl();
  return { loginUrl, subreddit, ...feed };
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = ({ params }) => {
  return {
    title: `Reddmix - ${params.subreddit}`,
    description: 'Welcome to Reddmix!',
  };
};

// https://remix.run/guides/routing#index-routes
export default function Subreddit() {
  const { loginUrl, subreddit, posts, after } = useLoaderData();

  return (
    <>
      <Header loginUrl={loginUrl} subreddit={subreddit} />
      <main className="w-full">
        {!posts && (
          <div className="text-center text-2xl font-bold">
            Could not fetch all reddit posts.
          </div>
        )}
        <Feed initialPosts={posts} initialAfter={after} subreddit={subreddit} />
      </main>
    </>
  );
}
