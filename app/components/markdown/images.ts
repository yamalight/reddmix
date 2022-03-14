const imageRegex = /\.(jpg|jpeg|png|gif|bmp|svg)$/;

export function replaceRedditImages(html: string) {
  return html.replace(/<a href="(.+?)">(.+?)<\/a>/g, (match, p1, p2) => {
    if (imageRegex.test(p1)) {
      return `<img src="${p1}" alt="${p2}" />`;
    }
    return match;
  });
}
