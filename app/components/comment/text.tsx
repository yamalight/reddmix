import { decode } from 'html-entities';
import { useMemo } from 'react';
import Markdown from '../markdown/index';

export default function CommentText({ comment }) {
  const text = useMemo(() => decode(comment.body), [comment]);

  return <Markdown text={text} />;
}
