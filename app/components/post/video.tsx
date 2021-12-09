import { useMemo } from 'react';
import ReactPlayer from 'react-player';
import { getVideo } from './utils.js';

export default function VideoPost({ post }) {
  const video = useMemo(() => getVideo(post), [post]);

  return (
    <div className="flex flex-1 items-center justify-center">
      <ReactPlayer url={video} controls />
    </div>
  );
}
