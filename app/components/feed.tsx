import { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '~/hooks/useIntersectionObserver.js';
import Post from './post/index.js';

export default function Feed({
  initialPosts,
  initialAfter,
  subreddit = '',
}: {
  initialPosts: Array<any>;
  initialAfter: string;
  subreddit?: string;
}) {
  const loadMoreRef = useRef();
  const existingPostsRef = useRef<{ [postId: string]: boolean }>({});
  const [posts, setPosts] = useState<any>([]);
  const [after, setAfter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPosts(initialPosts);
    setAfter(initialAfter);
  }, [initialPosts, initialAfter]);

  const loadMore = async (isIntersecting: boolean) => {
    if (!isIntersecting || loading) {
      return;
    }

    setLoading(true);

    const res = await fetch('/api/paginate', {
      method: 'POST',
      body: JSON.stringify({ after, subreddit }),
    }).then((r) => r.json());

    setPosts(
      [...posts].concat(
        res.posts.filter((p) => !existingPostsRef.current[p.id])
      )
    );
    setAfter(res.after);
    setLoading(false);
  };

  useIntersectionObserver(loadMoreRef, loadMore, {
    rootMargin: '0px',
  });

  return (
    <>
      {posts && (
        <div className="flex flex-col p-4 gap-8 items-center">
          {posts.map((post) => {
            // mark current post as in-feed (used during pagination)
            existingPostsRef.current[post.id] = true;
            // return post render
            return <Post key={post.id} post={post} />;
          })}
          {loading && (
            <div className="text-gray-900 dark:text-gray-100">Loading..</div>
          )}
          {!loading && after && (
            <button
              ref={loadMoreRef}
              type="submit"
              onClick={() => loadMore(true)}
              className="text-gray-900 dark:text-gray-100"
            >
              Load more
            </button>
          )}
        </div>
      )}
    </>
  );
}
