import { json, LoaderFunction, MetaFunction, useLoaderData } from 'remix';
import MainContainer from '~/components/container.js';
import Feed from '~/components/feed.js';
import {
  executeWithTokenRefresh,
  generateLoginUrl,
  getAuthData,
} from '~/reddit/auth.js';
import { getSubFeed } from '~/reddit/client.js';

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = async ({ request }) => {
  const authData = await getAuthData(request);
  const loginUrl = authData ? undefined : generateLoginUrl();
  const result = await executeWithTokenRefresh(
    (authData) => getSubFeed({ authData }),
    request
  );
  if (result) {
    const { error, data, options } = result;
    if (error) {
      return { error };
    }
    return json({ loginUrl, ...data }, options);
  }

  return { error: 'Error fetching all!' };
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
    <MainContainer loginUrl={loginUrl}>
      {!posts && (
        <div className="text-center text-2xl font-bold">
          Could not fetch all reddit posts.
        </div>
      )}
      <Feed initialPosts={posts} initialAfter={after} subreddit="all" />
    </MainContainer>
  );
}
