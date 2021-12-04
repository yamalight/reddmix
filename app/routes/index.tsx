import { json, LoaderFunction, MetaFunction, useLoaderData } from 'remix';
import Header from '~/components/header.js';
import Post from '~/components/post.js';
import { redditAuth } from '~/cookies.js';
import { generateLoginUrl, getAuthData, refreshToken } from '~/reddit/auth.js';
import { getFrontpage } from '~/reddit/client.js';

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = async ({ request }) => {
  let authData = await getAuthData(request);
  if (authData?.access_token) {
    try {
      const posts = await getFrontpage(authData);
      return { posts };
    } catch (error) {
      if (error.status !== 401) {
        return { error };
      }

      // If the access token is invalid, we need to generate a new one.
      authData = await refreshToken(authData);
      const posts = await getFrontpage(authData);
      return json(
        { posts },
        {
          headers: {
            'Set-Cookie': await redditAuth.serialize(authData),
          },
        }
      );
    }
  }

  const loginUrl = generateLoginUrl();
  return { loginUrl };
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: 'Reddmix',
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
            Please login to view your posts.
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
