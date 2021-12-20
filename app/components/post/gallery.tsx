import { useMemo, useState } from 'react';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import { getGallery } from './utils.js';

export default function ImageGalleryPost({ post, expanded }) {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const images = useMemo(() => getGallery(post), [post]);

  const prevPage = () => {
    if (index === 0) return;
    setLoading(true);
    setIndex(index - 1);
  };

  const nextPage = () => {
    if (index === images.length - 1) return;
    setLoading(true);
    setIndex(index + 1);
  };

  return (
    <>
      {!expanded && (
        <div className="flex items-stretch">
          <button
            className="w-12 disabled:opacity-25"
            onClick={prevPage}
            disabled={index === 0}
          >
            <AiFillCaretLeft className="w-full h-full text-gray-900 dark:text-gray-100" />
          </button>
          <div className="flex flex-1 items-center justify-center">
            <div className="relative">
              <img
                className={`object-contain max-h-[80vh] ${
                  loading && 'blur-lg animate-pulse'
                }`}
                src={images[index].url}
                alt={post.title}
                onLoad={() => setLoading(false)}
              />
            </div>
          </div>
          <button
            className="w-12 disabled:opacity-25"
            onClick={nextPage}
            disabled={index === images.length - 1}
          >
            <AiFillCaretRight className="w-full h-full text-gray-900 dark:text-gray-100" />
          </button>
        </div>
      )}
      {expanded && (
        <div className="flex flex-col gap-8">
          {images.map((image) => (
            <div className="flex flex-1 items-center justify-center">
              <div className="relative">
                <img
                  className="object-contain max-h-[90vh]"
                  src={image.url}
                  alt={post.title}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
