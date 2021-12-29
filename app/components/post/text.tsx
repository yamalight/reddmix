import { decode } from 'html-entities';
import { useMemo } from 'react';
import Markdown from '../markdown.js';

export default function TextPost({ post, expanded }) {
  const text = useMemo(() => decode(post.selftext), [post]);
  return (
    <div className={`${expanded ? '' : 'max-h-[70vh] overflow-auto'}`}>
      <Markdown text={text} />
    </div>
  );
}
