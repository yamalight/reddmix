import { formatDistanceToNow } from 'date-fns';
import { useMemo, useState } from 'react';
import { BiDownvote, BiUpvote } from 'react-icons/bi';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import Awards from '../awards.jsx';
import CommentText from './text.jsx';

const colors = [
  'border-gray-400',
  'border-purple-400',
  'border-red-400',
  'border-yellow-400',
  'border-green-400',
  'border-orange-400',
  'border-teal-400',
  'border-rose-400',
  'border-cyan-400',
  'border-pink-400',
  'border-lime-400',
  'border-sky-400',
  'border-violet-400',
  'border-emerald-400',
  'border-fuchsia-400',
  'border-blue-400',
  'border-amber-400',
  'border-indigo-400',
];
const colorsDark = [
  'border-gray-700',
  'border-purple-700',
  'border-red-700',
  'border-yellow-700',
  'border-green-700',
  'border-orange-700',
  'border-teal-700',
  'border-rose-700',
  'border-cyan-700',
  'border-pink-700',
  'border-lime-700',
  'border-sky-700',
  'border-violet-700',
  'border-emerald-700',
  'border-fuchsia-700',
  'border-blue-700',
  'border-amber-700',
  'border-indigo-700',
];

export default function Comment({ comment, level = 0 }) {
  const [expanded, setExpanded] = useState(true);
  const date = useMemo(
    () => (comment.created_utc ? new Date(comment.created_utc * 1000) : -1),
    [comment]
  );

  if (!comment.body?.length) {
    return null;
  }

  return (
    <div className="flex overflow-hidden w-full max-w-screen-xl">
      <button
        className="flex flex-col w-4 items-center font-bold text-gray-800 dark:text-gray-300"
        onClick={() => setExpanded((e) => !e)}
      >
        {expanded ? (
          <RiArrowDownSFill className="w-6 h-6" />
        ) : (
          <RiArrowRightSFill className="w-6 h-6" />
        )}
        <div
          className={`w-1 h-full border-l-2 border-opacity-25 dark:border-opacity-40 ${colors[level]} dark:${colorsDark[level]}`}
        />
      </button>
      <div className="flex flex-col">
        <div className="flex p-2 items-center">
          <span className="text-sm font-bold mr-2 text-gray-600 dark:text-gray-400">
            <a href={`https://www.reddit.com/user/${comment.author}`}>
              {comment.author}
            </a>
          </span>
          <span className="mx-1 text-gray-600 dark:text-gray-400">•</span>
          <time
            dateTime={date.toISOString()}
            title={date.toLocaleString()}
            className="text-xs text-gray-500 dark:text-gray-400 mx-2"
          >
            {formatDistanceToNow(date, { addSuffix: true })}
          </time>
          <Awards awards={comment.all_awardings} />
        </div>
        {expanded && (
          <>
            <CommentText comment={comment} />
            <div className="flex p-2 my-2 items-center gap-2 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <BiUpvote className="w-5 h-5" />
                {comment.ups}
                <BiDownvote className="w-5 h-5" />
              </div>
            </div>

            {/* debuggin json  */}
            {process.env.NODE_ENV === 'development' && (
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
                <Comment
                  key={child.data.id}
                  comment={child.data}
                  level={level + 1}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
