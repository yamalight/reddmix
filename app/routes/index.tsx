import { LoaderFunction, MetaFunction, useLoaderData } from 'remix';
import { redditAuth } from '~/cookies';

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = async ({ request }) => {
  const loginUrl = `https://www.reddit.com/api/v1/authorize?client_id=${
    process.env.REDDIT_CLIENT_ID
  }&response_type=code&state=${Date.now()}&redirect_uri=${
    process.env.REDDIT_REDIRECT_URI
  }&duration=permanent&scope=read`;

  let cookieHeader = request.headers.get('Cookie');
  let authData = await redditAuth.parse(cookieHeader);

  // https://remix.run/api/remix#json
  return { loginUrl, authData };
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: 'Remix Starter',
    description: 'Welcome to remix!',
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const { loginUrl, authData } = useLoaderData();

  return (
    <div className="container">
      <main>
        {authData !== null && (
          <div>
            You are logged in
            <pre>{JSON.stringify(authData, null, 2)}</pre>
          </div>
        )}
        {!authData && <a href={loginUrl}>Login with Reddit</a>}
      </main>
    </div>
  );
}
