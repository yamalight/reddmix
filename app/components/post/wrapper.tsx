import { formatDistanceToNow } from 'date-fns';
import { useMemo } from 'react';
import { BiDownvote, BiUpvote } from 'react-icons/bi';
import Awards from '../awards.js';

export default function PostWrapper({ post, children }) {
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
      <p className="p-2 text-2xl font-semibold text-gray-800 mb-2">
        <a href={`https://reddit.com/${post.permalink}`}>{post.title}</a>
      </p>
      {children}
      <div className="flex p-2 my-2 items-center gap-2">
        <div className="flex items-center gap-1">
          <BiUpvote className="w-6 h-6" />
          {post.ups}
          <BiDownvote className="w-6 h-6" />
        </div>
        <a href="#">{post.num_comments} comments</a>
      </div>

      {/* debuggin json  */}
      {window.ENV.NODE_ENV !== 'production' && (
        <details className="mt-6">
          <summary className="text-sm font-medium text-neutral-600">
            Post JSON
          </summary>
          <pre className="mt-2">
            <code>{JSON.stringify(post, null, 2)}</code>
          </pre>
        </details>
      )}
    </div>
  );
}
