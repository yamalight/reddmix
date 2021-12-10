import { useMemo } from 'react';
import { getImage } from './utils.js';

export default function ImagePost({ post }) {
  const image = useMemo(() => getImage(post), [post]);

  if (!image) {
    return null;
  }

  return (
    <div className="flex flex-shrink-0 items-center justify-center">
      <img
        className="object-contain max-h-[80vh]"
        src={image}
        alt={post.title}
      />
    </div>
  );
}
