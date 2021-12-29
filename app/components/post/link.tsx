import { useMemo } from 'react';
import { getImage } from './utils.js';

export default function LinkPost({ post }) {
  const { image } = useMemo(() => getImage(post), [post]);

  if (!post.url_overridden_by_dest) {
    return null;
  }

  return (
    <div className="flex items-center justify-between pr-2">
      <div className="flex text-base underline text-gray-500 decoration-slate-500 dark:text-gray-300 dark:decoration-slate-200 px-4 mt-2">
        <a href={post.url_overridden_by_dest}>{post.url_overridden_by_dest}</a>
      </div>
      {image && (
        <div className="hidden sm:flex flex-shrink-0 w-28 h-28 items-center justify-center">
          <img className="object-contain" src={image} alt={post.title} />
        </div>
      )}
    </div>
  );
}
