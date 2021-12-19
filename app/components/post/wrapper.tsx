import { formatDistanceToNow } from 'date-fns';
import { useMemo } from 'react';
import { BiDownvote, BiLinkExternal, BiUpvote } from 'react-icons/bi';
import { Link } from 'remix';
import Awards from '../awards.js';

export default function PostWrapper({ post, expanded, children }) {
  const date = useMemo(() => new Date(post.created_utc * 1000), [post]);

  return (
    <div
      className={`flex flex-col overflow-hidden ${
        expanded
          ? ''
          : 'rounded-lg shadow-lg border border-gray-100 dark:border-gray-800'
      } w-full max-w-screen-xl dark:shadow-gray-800 bg-gray-50 dark:bg-gray-800`}
    >
      <div className="flex p-2 items-center">
        <Link
          to={`/r/${post.subreddit}`}
          className="text-lg font-bold mx-2 text-gray-900 dark:text-gray-100"
        >
          r/{post.subreddit}
        </Link>
        <span className="mx-1">•</span>
        <span className="text-sm text-gray-500 dark:text-gray-400 mx-2">
          Posted by{' '}
          <a href={`https://www.reddit.com/user/${post.author_fullname}`}>
            u/{post.author_fullname}
          </a>
        </span>
        <time
          dateTime={date.toISOString()}
          title={date.toLocaleString()}
          className="text-sm text-gray-500 dark:text-gray-400 mx-2"
        >
          {formatDistanceToNow(date, { addSuffix: true })}
        </time>
        <Awards awards={post.all_awardings} />
      </div>
      <div className="flex items-center mb-2">
        <p className="p-2 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          <Link to={post.permalink}>
            {post.title?.replaceAll?.('&amp;', '&') ?? post.title}
          </Link>
        </p>
        <a
          href={`https://reddit.com/${post.permalink}`}
          className="ml-1 text-gray-900 dark:text-gray-200"
        >
          <BiLinkExternal />
        </a>
        {post.link_flair_text?.length > 0 && (
          <span className="text-xs px-2 font-medium bg-gray-500 bg-opacity-10 text-gray-800 dark:text-gray-200 rounded ml-1 py-1">
            {post.link_flair_text}
          </span>
        )}
        {post.whitelist_status === 'promo_adult_nsfw' && (
          <span className="text-xs px-2 font-medium bg-gray-500 bg-opacity-10 text-red-800 border-red-800 rounded ml-1 py-1">
            NSFW
          </span>
        )}
      </div>
      {children}
      <div className="flex p-2 my-2 items-center gap-2 text-gray-800 dark:text-gray-200">
        <div className="flex items-center gap-1">
          <BiUpvote className="w-6 h-6" />
          {post.ups}
          <BiDownvote className="w-6 h-6" />
        </div>
        <Link to={post.permalink}>{post.num_comments} comments</Link>
      </div>

      {/* debuggin json  */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-6 text-gray-800 dark:text-gray-200">
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
