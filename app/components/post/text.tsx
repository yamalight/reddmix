import { decode } from 'html-entities';
import { useMemo } from 'react';
import Markdown from '../markdown.js';

export default function TextPost({ post }) {
  const text = useMemo(() => decode(post.selftext), [post]);
  return <Markdown text={text} />;
}
