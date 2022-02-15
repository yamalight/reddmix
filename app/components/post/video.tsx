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

  const handleVolumeChange = (e) => {
    const newVolume = Math.round(e.target.volume * 100) / 100;
    // save to local storage
    localStorage.setItem('reddmix-volume', newVolume.toString());
  };

  useEffect(() => {
    if (!playerRef.current || (!video && !fallback)) {
      return;
    }

    if (Hls.isSupported()) {
      // init hls instance if needed
      if (!hlsRef.current) {
        hlsRef.current = new Hls({
          abrEwmaDefaultEstimate: 100000,
          autoStartLoad: true,
          startLevel: -1,
          startPosition: 0,
        });
        hlsRef.current.attachMedia(playerRef.current);
      }
      // load source
      if (video) {
        hlsRef.current.loadSource(video);
        hlsRef.current.config.startPosition = 0;
      } else if (fallback) {
        playerRef.current.src = fallback;
      }
    } else if (fallback) {
      playerRef.current.src = fallback;
    }

    // restore volume from localStorage (if available)
    const storedVolume = localStorage.getItem('reddmix-volume');
    if (storedVolume) {
      playerRef.current.volume = parseFloat(storedVolume);
      playerRef.current.muted = false;
    }

    return () => {
      // reset player
      if (playerRef.current?.src) {
        playerRef.current.src = '';
      }
      // destroy hls instance
      hlsRef.current?.destroy();
    };
  }, [playerRef, video, fallback]);

  return (
    <>
      {(video || fallback) && (
        <div className="flex items-center justify-center max-h-[70vh] h-[70vh]">
          <video
            ref={playerRef}
            poster={poster}
            onVolumeChange={handleVolumeChange}
            muted
            preload="auto"
            controls
            className="h-full w-full aspect-video"
          />
        </div>
      )}
      {embed && (
        <div
          className="flex items-center justify-center max-h-[70vh] h-[70vh]"
          dangerouslySetInnerHTML={{ __html: embed }}
        />
      )}
    </>
  );
}
