import Header from '~/components/header.js';

export default function MainContainer({ loginUrl, subreddit, children }) {
  return (
    <>
      <Header loginUrl={loginUrl} subreddit={subreddit} />
      <main className="w-full h-full pt-16">{children}</main>
    </>
  );
}
