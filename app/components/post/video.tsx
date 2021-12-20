import Hls from 'hls.js';
import { useEffect, useMemo, useRef } from 'react';
import { getVideo } from './utils.js';

export default function VideoPost({ post }) {
  const playerRef = useRef<HTMLVideoElement>();
  const hlsRef = useRef<Hls>();
  const { poster, fallback, video, embed } = useMemo(
    () => getVideo(post),
    [post]
  );

  useEffect(() => {
    if (!playerRef.current || !video) {
      return;
    }

    if (Hls.isSupported()) {
      // init hls instance if needed
      if (!hlsRef.current) {
        hlsRef.current = new Hls({
          abrEwmaDefaultEstimate: 100000,
          autoStartLoad: true,
          startLevel: -1,
        });
        hlsRef.current.attachMedia(playerRef.current);
      }
      // load source
      hlsRef.current.loadSource(video);
    } else if (fallback) {
      playerRef.current.src = fallback;
    }
  }, [playerRef, video, fallback]);

  return (
    <div className="flex items-center justify-center max-h-[70vh] h-[70vh]">
      {video && (
        <video
          ref={playerRef}
          poster={poster}
          muted
          preload="auto"
          controls
          className="h-full w-full aspect-video"
        />
      )}
      {embed && <div dangerouslySetInnerHTML={{ __html: embed }} />}
    </div>
  );
}
