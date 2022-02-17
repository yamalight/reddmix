import { decode } from 'html-entities';
import { useEffect, useMemo, useState } from 'react';
import { getImage } from './utils.js';

export default function LinkPost({ post }) {
  const [imageHidden, setImageHidden] = useState(false);
  const { image } = useMemo(() => getImage(post), [post]);
  const link = useMemo(
    () =>
      post.url_overridden_by_dest
        ? decode(post.url_overridden_by_dest)
        : undefined,
    [post]
  );

  useEffect(() => {
    setImageHidden(false);
  }, [post]);

  const hideImage = () => setImageHidden(true);

  if (!link) {
    return null;
  }

  return (
    <div className="flex items-center justify-between pr-2">
      <div className="flex text-base underline text-gray-500 decoration-slate-500 dark:text-gray-300 dark:decoration-slate-200 px-4 mt-2">
        <a href={link}>{link}</a>
      </div>
      {image && !imageHidden && (
        <div className="hidden sm:flex flex-shrink-0 w-28 h-28 items-center justify-center">
          <img
            className="object-contain"
            src={image}
            alt={post.title}
            onError={hideImage}
          />
        </div>
      )}
    </div>
  );
}
