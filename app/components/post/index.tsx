import { useMemo } from 'react';
import ImageGalleryPost from './gallery.js';
import ImagePost from './image.js';
import LinkPost from './link.js';
import TextPost from './text.js';
import VideoPost from './video.js';
import PostWrapper from './wrapper.js';

export default function Post({ post, expanded }) {
  const type = useMemo(() => {
    if (post.post_hint === 'self' || post.is_self) {
      return 'text';
    }
    if (post.post_hint === 'image') {
      return 'image';
    }
    if (post.post_hint?.includes?.('video')) {
      return 'video';
    }
    if (post.gallery_data?.items?.length > 0) {
      return 'gallery';
    }
    if (post.post_hint === 'link') {
      return 'link';
    }
    // TODO: handle poll
    // if (post.is_poll) {
    // return 'poll';
    // }
    return 'link';
  }, [post]);

  return (
    <PostWrapper post={post} expanded={expanded}>
      {type === 'text' && <TextPost post={post} expanded={expanded} />}
      {type === 'image' && <ImagePost post={post} />}
      {type === 'gallery' && (
        <ImageGalleryPost post={post} expanded={expanded} />
      )}
      {type === 'video' && <VideoPost post={post} />}
      {type === 'link' && <LinkPost post={post} />}
    </PostWrapper>
  );
}
