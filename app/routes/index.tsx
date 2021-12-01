import { LoaderFunction, MetaFunction, useLoaderData } from 'remix';
import { redditAuth } from '~/cookies';
import { getFrontpage } from '~/reddit.js';

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

  if (authData.access_token) {
    const posts = await getFrontpage(authData);
    return { posts };
  }

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
  const { loginUrl, posts } = useLoaderData();

  return (
    <div className="container">
      <main>
        {posts && (
          <div>
            You are logged in
            <div className="grid max-w-lg gap-5 mx-auto lg:grid-cols-3 lg:max-w-none">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col overflow-hidden rounded-lg shadow-lg"
                >
                  {post.thumbnail !== 'self' && (
                    <div className="flex-shrink-0">
                      <img
                        className="object-cover w-full h-48"
                        src={post.thumbnail}
                        alt=""
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-between flex-1 p-6 bg-white">
                    <div className="flex-1">
                      <a href="#" className="block mt-2">
                        <p className="text-xl font-semibold text-neutral-600">
                          <a href={`https://reddit.com/${post.permalink}`}>
                            {post.title}
                          </a>
                        </p>
                        <p className="mt-3 text-base text-gray-500">
                          {' '}
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Architecto accusantium praesentium eius, ut
                          atque fuga culpa, similique sequi cum eos quis
                          dolorum.{' '}
                        </p>
                      </a>
                    </div>
                    <div className="flex items-center mt-6">
                      <div className="flex-shrink-0">
                        <a
                          href={`https://reddit.com/user/${post.author_fullname}`}
                        >
                          <span className="sr-only">
                            {post.author_fullname}
                          </span>
                        </a>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-neutral-600">
                          <a
                            href={`https://reddit.com/user/${post.author_fullname}`}
                            className="hover:underline"
                          >
                            {post.author_fullname}
                          </a>
                        </p>
                        <div className="flex space-x-1 text-sm text-gray-500">
                          <time
                            dateTime={new Date(post.created_utc).toISOString()}
                          >
                            {new Date(post.created_utc).toLocaleDateString()}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {loginUrl && <a href={loginUrl}>Login with Reddit</a>}
      </main>
    </div>
  );
}
