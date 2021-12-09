import { useMemo, useState } from 'react';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import { getGallery } from './utils.js';

export default function ImageGalleryPost({ post }) {
  const [index, setIndex] = useState(0);
  const images = useMemo(() => getGallery(post), [post]);

  const prevPage = () => {
    if (index === 0) return;
    setIndex(index - 1);
  };

  const nextPage = () => {
    if (index === images.length - 1) return;
    setIndex(index + 1);
  };

  return (
    <>
      <div className="flex items-stretch">
        <button
          className="w-12 disabled:opacity-25"
          onClick={prevPage}
          disabled={index === 0}
        >
          <AiFillCaretLeft className="w-full h-full" />
        </button>
        <div className="flex flex-1 items-center justify-center">
          <img
            className="object-contain max-h-screen"
            src={images[index].url}
            alt={post.title}
          />
        </div>
        <button
          className="w-12 disabled:opacity-25"
          onClick={nextPage}
          disabled={index === images.length - 1}
        >
          <AiFillCaretRight className="w-full h-full" />
        </button>
      </div>
    </>
  );
}
