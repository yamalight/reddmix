import { formatDistanceToNow } from 'date-fns';
import { useMemo } from 'react';
import Awards from './awards.js';

export default function Post({ post }) {
  const date = useMemo(() => new Date(post.created_utc * 1000), [post]);

  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-lg border border-gray-100">
      <div className="flex p-2 items-center">
        <a href="#" className="text-lg font-bold mx-2">
          r/{post.subreddit}
        </a>
        <span className="mx-1">•</span>
        <span className="text-sm text-gray-500 mx-2">
          Posted by <a href="#">u/{post.author_fullname}</a>
        </span>
        <time
          dateTime={date.toISOString()}
          title={date.toLocaleString()}
          className="text-sm text-gray-500 mx-2"
        >
          {formatDistanceToNow(date, { addSuffix: true })}
        </time>
        <Awards awards={post.all_awardings} />
      </div>
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
              <a href={`https://reddit.com/${post.permalink}`}>{post.title}</a>
            </p>
            <p className="mt-3 text-base text-gray-500">
              {' '}
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Architecto accusantium praesentium eius, ut atque fuga culpa,
              similique sequi cum eos quis dolorum.{' '}
            </p>
          </a>
        </div>
        <div className="flex items-center mt-6">
          <div className="flex-shrink-0">
            <a href={`https://reddit.com/user/${post.author_fullname}`}>
              <span className="sr-only">{post.author_fullname}</span>
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
              <time dateTime={new Date(post.created_utc).toISOString()}>
                {new Date(post.created_utc).toLocaleDateString()}
              </time>
            </div>
          </div>
        </div>
      </div>
      <details className="mt-6">
        <summary className="text-sm font-medium text-neutral-600">
          Post JSON
        </summary>
        <pre className="mt-2">
          <code>{JSON.stringify(post, null, 2)}</code>
        </pre>
      </details>
    </div>
  );
}
