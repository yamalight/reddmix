import { decode } from 'html-entities';

const imageRegex = /\.(jpg|jpeg|png|gif|bmp|svg)$/;
const videoRegex = /\.(gifv|mp4|webm)$/;

const embedClasses = 'w-full h-full min-h-[70vh] aspect-video !relative';

export const getImage = (post) => {
  // handle cross-posts
  const actualPost = post.crosspost_parent_list?.[0] ?? post;
  // handle images
  const images = actualPost.preview?.images?.[0];
  // get source image
  const sourceImage = images?.source?.url;
  let source = decode(sourceImage);
  // if source is not set - try to get from URL
  if (!source) {
    source = actualPost.url_overridden_by_dest;
  }
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
    const sourceImage = metadata?.s?.u ?? metadata?.s?.gif;
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
  if (embed) {
    const cleanEmbed = decode(embed);
    const styledEmbed = cleanEmbed.includes('class=')
      ? cleanEmbed.replace('class="', `class="${embedClasses} `)
      : cleanEmbed.replace('<iframe', `<iframe class="${embedClasses}" `);
    return { embed: styledEmbed };
  }

  // get post link
  let postLink = actualPost?.url_overridden_by_dest;

  // try to get youtube video
  if (postLink && postLink.includes('youtube.com')) {
    const youtubeId = postLink.match(/v=([^&]*)/);
    const youtubeIdString = youtubeId?.[1];
    const embed = `<iframe class="${embedClasses}" src="https://www.youtube.com/embed/${youtubeIdString}?feature=oembed&enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    return { embed };
  }

  // try to get gfycat embed
  if (postLink && postLink.includes('gfycat.com')) {
    const gfycatId = postLink.match(/gfycat.com\/([^&]*)/);
    let gfycatIdString = gfycatId?.[1];
    if (gfycatIdString.includes('-')) {
      gfycatIdString = gfycatIdString.split('-')[0];
    }
    const embed = `<iframe class="${embedClasses}" src="https://gfycat.com/ifr/${gfycatIdString}" frameborder="0" allowfullscreen></iframe>`;
    return { embed };
  }

  if (postLink && postLink.includes('imgur.com')) {
    // replace main domain with i.imgur for direct access to resources
    if (!postLink.includes('i.imgur.com')) {
      postLink = postLink.replace('imgur.com', 'i.imgur.com');
    }
    // replace gifv with mp4 for better playback
    postLink = postLink.replace('.gifv', '.mp4');
    return {
      fallback: postLink,
    };
  }

  // otherwise use link as fallback video
  if (postLink && postLink.match(videoRegex)) {
    return {
      fallback: postLink,
    };
  }
};

export const getText = (post) => {
  // handle cross-posts
  const actualPost = post.crosspost_parent_list?.[0] ?? post;
  return decode(actualPost.selftext);
};

export const isImagePost = (post) => {
  if (post.post_hint === 'image') {
    return true;
  }
  if (post.url_overridden_by_dest?.match(imageRegex)) {
    return true;
  }
  return false;
};

export const isVideoPost = (post) => {
  if (
    post.post_hint?.includes?.('video') ||
    post.media?.reddit_video !== undefined
  ) {
    return true;
  }
  // handle links that end with mp4 or gifv as videos
  if (post.url_overridden_by_dest?.match(videoRegex)) {
    return true;
  }
  // handle links to youtube as video posts
  if (post.url_overridden_by_dest?.includes('youtube.com')) {
    return true;
  }
  // handle links to gfycat as video posts
  if (post.url_overridden_by_dest?.includes('gfycat.com')) {
    return true;
  }
  return false;
};
