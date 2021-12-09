import { formatDistanceToNow } from 'date-fns';
import { useMemo, useState } from 'react';
import { BiDownvote, BiUpvote } from 'react-icons/bi';
import Awards from '../awards.jsx';
import CommentText from './text.jsx';

export default function Comment({ comment }) {
  const [expanded, setExpanded] = useState(true);
  const date = useMemo(
    () => (comment.created_utc ? new Date(comment.created_utc * 1000) : -1),
    [comment]
  );
  const isProduction = useMemo(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.ENV?.NODE_ENV !== 'production';
  }, []);

  if (!comment.body?.length) {
    return null;
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-md border border-gray-100 w-full max-w-screen-xl">
      <div className="flex p-2 items-center">
        <button className="font-bold" onClick={() => setExpanded((e) => !e)}>
          {expanded ? '[-]' : '[+]'}
        </button>
        <span className="text-lg font-bold mx-2">
          <a href={`https://www.reddit.com/user/${comment.author}`}>
            {comment.author}
          </a>
        </span>
        <span className="mx-1">•</span>
        <time
          dateTime={date.toISOString()}
          title={date.toLocaleString()}
          className="text-sm text-gray-500 mx-2"
        >
          {formatDistanceToNow(date, { addSuffix: true })}
        </time>
        <Awards awards={comment.all_awardings} />
      </div>
      {expanded && (
        <>
          <CommentText comment={comment} />
          <div className="flex p-2 my-2 items-center gap-2">
            <div className="flex items-center gap-1">
              <BiUpvote className="w-6 h-6" />
              {comment.ups}
              <BiDownvote className="w-6 h-6" />
            </div>
          </div>

          {/* debuggin json  */}
          {isProduction && (
            <details className="mt-6">
              <summary className="text-sm font-medium text-neutral-600">
                Comment JSON
              </summary>
              <pre className="mt-2">
                <code>{JSON.stringify(comment, null, 2)}</code>
              </pre>
            </details>
          )}

          <div className="pl-8">
            {comment?.replies?.data?.children.map((child) => (
              <Comment key={child.data.id} comment={child.data} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
