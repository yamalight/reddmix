export const getFrontpage = async ({ access_token }) => {
  const result = await fetch('https://oauth.reddit.com/', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }).then((r) => r.json());

  const posts = result?.data?.children?.map((post) => post.data);

  return posts;
};
