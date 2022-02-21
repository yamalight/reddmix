const imageRegex = /\.(jpg|jpeg|png|gif|bmp|svg)$/;

export async function retextRedditPreviewToImages() {
  const { visit } = await import('unist-util-visit');

  return function retextRedditImages() {
    function transformer(tree) {
      // go through all links
      visit(tree, 'link', function (node) {
        const url = new URL(node.url);
        // if url ends with image extension
        if (url.pathname.match(imageRegex)) {
          // convert to image
          node.type = 'image';
        }
      });
    }

    return transformer;
  };
}
