import { useMemo } from 'react';
import { getImage } from './utils.js';

export default function LinkPost({ post }) {
  const image = useMemo(() => getImage(post), [post]);

  if (!post.url_overridden_by_dest) {
    return null;
  }

  return (
    <div className="flex items-center justify-between pr-4">
      <div className="text-base text-gray-500 px-4 mt-2 bg-white prose max-w-max">
        <a href={post.url_overridden_by_dest}>{post.url_overridden_by_dest}</a>
      </div>
      {image && (
        <div className="flex flex-shrink-0 w-20 h-20 items-center justify-center">
          <img className="object-contain" src={image} alt={post.title} />
        </div>
      )}
    </div>
  );
}
