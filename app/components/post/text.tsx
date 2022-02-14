import { useMemo } from 'react';
import Markdown from '../markdown/index';
import { getText } from './utils';

export default function TextPost({ post, expanded }) {
  const text = useMemo(() => getText(post), [post]);
  return (
    <div className={`${expanded ? '' : 'max-h-[70vh] overflow-auto'}`}>
      <Markdown text={text} />
    </div>
  );
}
