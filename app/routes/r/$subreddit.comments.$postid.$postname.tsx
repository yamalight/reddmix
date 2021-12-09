import { LoaderFunction, MetaFunction, useLoaderData } from 'remix';
import Comment from '~/components/comment/index.js';
import Header from '~/components/header.js';
import Post from '~/components/post/index.js';
import { generateLoginUrl, getAuthData } from '~/reddit/auth.js';
import { getPost } from '~/reddit/client.js';

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = async ({ request, params }) => {
  const authData = await getAuthData(request);
  const { subreddit, postid, postname } = params;
  const data = await getPost({ subreddit, postid, postname });
  const loginUrl = authData ? undefined : generateLoginUrl();
  return { loginUrl, subreddit, ...data };
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = ({ params }) => {
  return {
    title: `Reddmix - ${params.subreddit}`,
    description: 'Welcome to Reddmix!',
  };
};

// https://remix.run/guides/routing#index-routes
export default function PostPage() {
  const { loginUrl, subreddit, post, comments, after } = useLoaderData();

  return (
    <>
      <Header loginUrl={loginUrl} subreddit={subreddit} />
      <main className="w-full">
        <div className="flex justify-center w-full">
          <Post post={post} />
        </div>
        <div className="flex flex-col items-center w-full">
          {comments.map((comment) => (
            <Comment comment={comment} key={comment.id} />
          ))}
        </div>
      </main>
    </>
  );
}
