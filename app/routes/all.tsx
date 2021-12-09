import { LoaderFunction, MetaFunction, useLoaderData } from 'remix';
import Header from '~/components/header.js';
import Post from '~/components/post/index.js';
import { generateLoginUrl } from '~/reddit/auth.js';
import { getAllFeed } from '~/reddit/client.js';

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = async ({ request }) => {
  const feed = await getAllFeed();
  const loginUrl = generateLoginUrl();
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
  const { loginUrl, posts } = useLoaderData();

  return (
    <>
      <Header loginUrl={loginUrl} />
      <main className="container">
        {!posts && (
          <div className="text-center text-2xl font-bold">
            Could not fetch all reddit posts.
          </div>
        )}
        {posts && (
          <div className="flex flex-col p-4 gap-8">
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
