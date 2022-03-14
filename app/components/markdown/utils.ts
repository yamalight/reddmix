const imageRegex = /\.(jpg|jpeg|png|gif|bmp|svg)$/;
const gifRegex = /^\!\[gif\]\(giphy.+?\)/;

export function replaceRedditImages(html: string) {
  return html.replace(/<a href="(.+?)">(.+?)<\/a>/g, (match, p1, p2) => {
    try {
      const url = new URL(p1);
      if (imageRegex.test(url.pathname)) {
        return `<img src="${p1}" alt="${p2}" />`;
      }
      return match;
    } catch (e) {
      // return match if error out
      return match;
    }
  });
}

export function replaceRedditGifs(html: string) {
  return html.replace(/\!\[(.+?)\]\((.+?)\)/g, (match, p1, p2) => {
    if (gifRegex.test(match)) {
      const id = p2.split('|')[1];
      return `<iframe src="https://giphy.com/embed/${id}" frameBorder="0" class="min-h-[30vh] aspect-video"></iframe>`;
    }
    return match;
  });
}
