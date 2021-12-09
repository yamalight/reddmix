import { formatDistanceToNow } from 'date-fns';
import { useMemo } from 'react';
import { BiDownvote, BiUpvote } from 'react-icons/bi';
import Awards from '../awards.js';

export default function PostWrapper({ post, children }) {
  const date = useMemo(() => new Date(post.created_utc * 1000), [post]);
  const isProduction = useMemo(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.ENV?.NODE_ENV !== 'production';
  }, []);

  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-lg border border-gray-100 w-full max-w-screen-xl">
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
      <p className="flex items-center p-2 text-2xl font-semibold text-gray-800 mb-2">
        <a href={`https://reddit.com/${post.permalink}`}>
          {post.title.replaceAll('&amp;', '&')}
        </a>
        {post.link_flair_text?.length > 0 && (
          <span className="text-xs px-2 font-medium bg-gray-500 bg-opacity-10 text-gray-800 rounded ml-2 py-1">
            {post.link_flair_text}
          </span>
        )}
        {post.whitelist_status === 'promo_adult_nsfw' && (
          <span className="text-xs px-2 font-medium bg-gray-500 bg-opacity-10 text-red-800 border-red-800 rounded ml-2 py-1">
            NSFW
          </span>
        )}
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
      {isProduction && (
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
