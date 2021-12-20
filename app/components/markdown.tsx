import { useEffect, useRef, useState } from 'react';

export default function Markdown({ text }) {
  const Md = useRef();
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    (async () => {
      // load react-markdown component
      Md.current = (await import('react-markdown')).default;
      // load and set markdown plugins
      const remarkGfm = (await import('remark-gfm')).default;
      setPlugins([remarkGfm]);
    })();
  }, []);

  return (
    <div className="text-lg px-4 mt-2 prose prose-zinc dark:prose-invert max-w-max">
      {Md.current ? (
        <Md.current children={text} remarkPlugins={plugins} />
      ) : (
        text
      )}
    </div>
  );
}
