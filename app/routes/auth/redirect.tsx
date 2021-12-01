import { json, LoaderFunction, MetaFunction, useLoaderData } from 'remix';
import { redditAuth } from '~/cookies';

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: 'Remix Starter',
    description: 'Welcome to remix!',
  };
};

export let loader: LoaderFunction = async ({ request }) => {
  let url = new URL(request.url);
  let code = url.searchParams.get('code');

  const result = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        process.env.REDDIT_CLIENT_ID + ':' + process.env.REDDIT_CLIENT_SECRET
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${process.env.REDDIT_REDIRECT_URI}`,
  }).then((res) => res.json());

  const options = result.access_token
    ? {
        headers: {
          'Set-Cookie': await redditAuth.serialize(result),
        },
      }
    : {};

  return json(result, options);
};

// https://remix.run/guides/routing#index-routes
export default function RedditRedirect() {
  const data = useLoaderData();

  return (
    <div className="container">
      <main>
        Login successful!
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </main>
    </div>
  );
}
