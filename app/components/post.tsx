import { formatDistanceToNow } from 'date-fns';
import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import Awards from './awards.js';

// FIXME: update react-markdown to v7 once Remix
// correctly supports importing of ES Modules

const getImage = (post) => {
  if (post.selftext?.length > 0) {
    return;
  }
  const images = post.preview?.images?.[0];
  const sourceImage = images?.source?.url;
  return sourceImage?.replace(/&amp;/g, '&');
};

export default function Post({ post }) {
  const date = useMemo(() => new Date(post.created_utc * 1000), [post]);
  const image = useMemo(() => getImage(post), [post]);

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
      <p className="p-2 text-2xl font-semibold text-neutral-600 mb-2">
        <a href={`https://reddit.com/${post.permalink}`}>{post.title}</a>
      </p>
      {image && (
        <div className="flex flex-shrink-0 items-center justify-center">
          <img className="object-contain" src={image} alt={post.title} />
        </div>
      )}
      <div className="text-base text-gray-500 px-4 mt-2 bg-white prose max-w-max">
        <ReactMarkdown>{post.selftext}</ReactMarkdown>
      </div>

      {/* debuggin json */}
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
