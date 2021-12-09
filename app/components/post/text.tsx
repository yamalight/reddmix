import Markdown from '../markdown.js';

export default function TextPost({ post }) {
  return <Markdown text={post.selftext} />;
}
