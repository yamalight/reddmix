import { useEffect, useState } from 'react';
import * as Snudown from 'snudown-js';

export default function TextPost({ post }) {
  const [content, setContent] = useState(post.selftext);

  useEffect(() => {
    const html = Snudown.markdown(post.selftext);
    setContent(html);
  }, [post]);

  return (
    <div
      className="text-base text-gray-500 px-4 mt-2 bg-white prose max-w-max"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
