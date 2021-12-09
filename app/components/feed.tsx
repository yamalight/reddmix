import { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '~/hooks/useIntersectionObserver.js';
import Post from './post/index.js';

export default function Feed({ initialPosts, initialAfter, subreddit = '' }) {
  const loadMoreRef = useRef();
  const [posts, setPosts] = useState([]);
  const [after, setAfter] = useState(null);
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

    setPosts([...posts].concat(res.posts));
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
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
          {loading && <div>Loading..</div>}
          {!loading && after && (
            <button ref={loadMoreRef} type="submit" onClick={loadMore}>
              Load more
            </button>
          )}
        </div>
      )}
    </>
  );
}
