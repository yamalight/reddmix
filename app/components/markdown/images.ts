export async function retextRedditPreviewToImages() {
  const { visit } = await import('unist-util-visit');

  return function retextRedditImages() {
    function transformer(tree) {
      // go through all links
      visit(tree, 'link', function (node) {
        // if url includes any of frequently used image domains
        if (
          node.url.includes('preview.redd.it') ||
          node.url.includes('i.imgur.com')
        ) {
          // convert to image
          node.type = 'image';
        }
      });
    }

    return transformer;
  };
}
