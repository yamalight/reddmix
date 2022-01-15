import { useEffect, useRef, useState } from 'react';
import { retextRedditPreviewToImages } from './images.js';

export default function Markdown({ text }) {
  const Md = useRef();
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    (async () => {
      // load react-markdown component
      Md.current = (await import('react-markdown')).default;
      // load and set markdown plugins
      const remarkGfm = (await import('remark-gfm')).default;
      // load and set retext plugins
      const retextImage = await retextRedditPreviewToImages();
      // set markdown plugins
      setPlugins([remarkGfm, retextImage]);
    })();
  }, []);

  return (
    <div className="text-base sm:text-lg px-2 sm:px-4 mt-1 sm:mt-2 prose prose-zinc dark:prose-invert w-full sm:max-w-max">
      {Md.current ? (
        <Md.current children={text} remarkPlugins={plugins} />
      ) : (
        text
      )}
    </div>
  );
}
