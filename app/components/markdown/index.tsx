import { useMarkdown } from './snudown';

export default function Markdown({ text }: { text: string }) {
  const md = useMarkdown(text);

  return (
    <div
      className="text-base [overflow-wrap:anywhere] [hyphens:manual] sm:text-lg px-2 sm:px-4 mt-1 sm:mt-2 prose prose-zinc dark:prose-invert w-full sm:max-w-max"
      dangerouslySetInnerHTML={{ __html: md ? md : text }}
    />
  );
}
