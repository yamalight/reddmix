import { useMemo } from 'react';
import { markdown } from 'snudown-js';
import { replaceRedditGifs, replaceRedditImages } from './utils.js';

export const useMarkdown = (text: string) => {
  const md = useMemo(() => {
    const html = markdown(text);
    const htmlWithImages = replaceRedditImages(html);
    const res = replaceRedditGifs(htmlWithImages);
    return res;
  }, [text]);

  return md;
};
