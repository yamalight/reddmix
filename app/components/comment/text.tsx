import Markdown from '../markdown.js';

export default function CommentText({ comment }) {
  return <Markdown text={comment.body} />;
}
