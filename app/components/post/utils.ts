export const getImage = (post) => {
  const images = post.preview?.images?.[0];
  const sourceImage = images?.source?.url;
  return sourceImage?.replace(/&amp;/g, '&');
};

export const getGallery = (post) => {
  const items = post?.gallery_data?.items;
  if (!items) {
    return [];
  }

  return items.map(({ media_id, id }) => {
    const metadata = post.media_metadata[media_id];
    const sourceImage = metadata?.s?.u;
    return {
      id,
      url: sourceImage?.replace(/&amp;/g, '&'),
    };
  });
};

export const getVideo = (post) => {
  const video = post?.media?.reddit_video?.hls_url;
  return video?.replace(/&amp;/g, '&');
};
