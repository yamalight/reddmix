import { useMemo } from 'react';
import ReactPlayer from 'react-player';
import { getVideo } from './utils.js';

export default function VideoPost({ post }) {
  const video = useMemo(() => getVideo(post), [post]);

  return (
    <div className="flex items-center justify-center max-h-screen-70 h-screen-70">
      <ReactPlayer url={video} controls width="100%" height="100%" />
    </div>
  );
}
