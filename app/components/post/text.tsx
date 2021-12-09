import ReactMarkdown from 'react-markdown';

// FIXME: update react-markdown to v7 once Remix
// correctly supports importing of ES Modules

export default function TextPost({ post }) {
  return (
    <div className="text-base text-gray-500 px-4 mt-2 bg-white prose max-w-max">
      <ReactMarkdown>{post.selftext}</ReactMarkdown>
    </div>
  );
}
