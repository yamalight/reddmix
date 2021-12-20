import { useMemo } from 'react';
import { getImage } from './utils.js';

export default function ImagePost({ post }) {
  const { image, gif, mp4 } = useMemo(() => getImage(post), [post]);

  if (!image && !gif && !mp4) {
    return null;
  }

  return (
    <div className="flex flex-shrink-0 items-center justify-center">
      {!mp4 && (
        <img
          className="object-contain max-h-[80vh]"
          src={image ?? gif}
          alt={post.title}
        />
      )}
      {mp4 && (
        <video
          className="object-contain max-h-[80vh]"
          src={mp4}
          controls
          autoPlay
          loop
          muted
          playsInline
          poster={image}
        />
      )}
    </div>
  );
}
