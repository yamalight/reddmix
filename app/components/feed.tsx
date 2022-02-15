import { forwardRef, useEffect, useRef, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import Post from './post/index.js';

const Item = forwardRef(({ children, ...props }, ref) => {
  return (
    <div
      className="flex flex-col w-full max-w-screen-xl py-2"
      {...props}
      ref={ref}
    >
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
  const existingPostsRef = useRef<{ [postId: string]: boolean }>({});
  const [posts, setPosts] = useState<any>([]);
  const [after, setAfter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [overscan, setOverscan] = useState(900);

  useEffect(() => {
    setPosts(initialPosts);
    setAfter(initialAfter);
    setOverscan(window.innerHeight);
  }, [initialPosts, initialAfter]);

  const loadMore = async () => {
    if (loading) {
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

  return (
    <>
      {posts && (
        <div className="flex flex-col h-full">
          <Virtuoso
            totalCount={posts.length}
            overscan={overscan}
            className="w-full h-full"
            endReached={() => loadMore(true)}
            itemContent={(index) => {
              const post = posts[index];
              // mark current post as in-feed (used during pagination)
              existingPostsRef.current[post.id] = true;
              // return post render
              return <Post post={post} />;
            }}
            components={{ List, Item, Footer }}
          />
        </div>
      )}
    </>
  );
}
