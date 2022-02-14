import { forwardRef, useEffect, useRef, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useIntersectionObserver } from '~/hooks/useIntersectionObserver.js';
import Post from './post/index.js';

const Item = forwardRef(({ children, ...props }, ref) => {
  return (
    <div className="flex flex-col w-full max-w-screen-xl" {...props} ref={ref}>
      {children}
    </div>
  );
});

const List = forwardRef((props, ref) => {
  return <div className="flex flex-col items-center" {...props} ref={ref} />;
});

const Footer = () => {
  return (
    <div className="flex p-4 justify-center text-gray-900 dark:text-gray-100">
      Loading...
    </div>
  );
};

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
        <div className="flex flex-col h-full">
          <Virtuoso
            totalCount={posts.length}
            className="w-full h-full"
            endReached={() => loadMore(true)}
            itemContent={(index) => {
              const post = posts[index];
              // mark current post as in-feed (used during pagination)
              existingPostsRef.current[post.id] = true;
              // return post render
              return <Post post={post} />;
            }}
            components={{ Item, List, Footer }}
          />
        </div>
      )}
    </>
  );
}
