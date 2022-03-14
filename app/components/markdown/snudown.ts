import { useMemo } from 'react';
import { markdown } from 'snudown-js';
import { replaceRedditImages } from './images.js';

export const useMarkdown = (text: string) => {
  const md = useMemo(() => {
    const html = markdown(text);
    const res = replaceRedditImages(html);
    return res;
  }, [text]);

  return md;
};
