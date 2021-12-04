import { json, LoaderFunction, MetaFunction, useLoaderData } from 'remix';
import { redditAuth } from '~/cookies';
import { codeToToken } from '~/reddit/auth.js';

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: 'Reddmix Auth Redirect',
    description: 'Redirects to the auth page',
  };
};

export let loader: LoaderFunction = async ({ request }) => {
  let url = new URL(request.url);
  let code = url.searchParams.get('code');
  if (!code) {
    return { error: 'No code provided' };
  }

  const result = await codeToToken(code);
  const options = result.access_token
    ? {
        status: 303,
        headers: {
          Location: '/',
          'Set-Cookie': await redditAuth.serialize(result),
        },
      }
    : {};

  return json(result, options);
};

// https://remix.run/guides/routing#index-routes
export default function RedditRedirect() {
  const authData = useLoaderData();

  return (
    <div className="container">
      <main>
        <p className="font-bold text-xl text-red-800">Error logging in!</p>
        <pre>{JSON.stringify(authData, null, 2)}</pre>
      </main>
    </div>
  );
}
