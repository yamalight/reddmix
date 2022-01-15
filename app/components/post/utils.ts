import { decode } from 'html-entities';

export const getImage = (post) => {
  // handle cross-posts
  const actualPost = post.crosspost_parent_list?.[0] ?? post;
  // handle images
  const images = actualPost.preview?.images?.[0];
  // get source image
  const sourceImage = images?.source?.url;
  const source = decode(sourceImage);
  // try to get gif image
  const gifImage = images?.variants?.gif?.source?.url;
  const gif = decode(gifImage);
  // try to get mp4
  const mp4Image = images?.variants?.mp4?.source?.url;
  const mp4 = decode(mp4Image);

  return { image: source, gif, mp4 };
};

export const getGallery = (post) => {
  // handle cross-posts
  const actualPost = post.crosspost_parent_list?.[0] ?? post;
  // handle gallery
  const items = actualPost?.gallery_data?.items;
  if (!items) {
    return [];
  }

  return items.map(({ media_id, id }) => {
    const metadata = actualPost.media_metadata[media_id];
    const sourceImage = metadata?.s?.u;
    return {
      id,
      url: decode(sourceImage),
    };
  });
};

export const getVideo = (post) => {
  // handle cross-posts
  const actualPost = post.crosspost_parent_list?.[0] ?? post;
  // get video
  const poster = actualPost?.preview?.images?.[0]?.source?.url;

  // try to get reddit video
  const video = actualPost?.media?.reddit_video?.hls_url;
  if (video) {
    const fallback = actualPost?.media?.reddit_video?.fallback_url;
    return {
      poster: decode(poster),
      fallback: decode(fallback),
      video: decode(video),
    };
  }

  // try to get embed video
  const embed = actualPost?.media?.oembed?.html;
  const cleanEmbed = decode(embed);
  const styledEmbed = cleanEmbed.includes('class=')
    ? cleanEmbed.replace('class="', 'class="w-full h-full min-h-[70vh] ')
    : cleanEmbed.replace(
        '<iframe',
        '<iframe class="w-full h-full min-h-[70vh] aspect-video" '
      );
  return { embed: styledEmbed };
};
