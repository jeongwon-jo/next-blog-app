"use client"

import PostCard from "@/components/post/PostCard";
import { Post } from "@/types";
import { getPosts } from "@/utils/fetch";
import { cn } from "@/utils/style";
import { createClient } from "@/utils/supabase/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FC, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const supabase = createClient();

type PostListProps = {
  category?: string;
  tag?: string;
  className?: string;
  initialPosts?: Post[]
}

const PostList: FC<PostListProps> = ({ category, tag, className, initialPosts }) => {
  const { ref, inView } = useInView();
  const { data: postPages, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["posts", category ?? null, tag ?? null],
    queryFn: async ({ pageParam }) => {
      const posts = await getPosts({category, tag, page:pageParam})
      if (!posts) return { posts: [], nextPage: null };

      return { posts: posts, nextPage: posts.length === 5 ? pageParam + 5 : null };
    },
    initialData: initialPosts ? {
      pages: [{ posts: initialPosts, nextPage: initialPosts.length === 5 ? 5 : null }],
      pageParams: [0],
    } : undefined,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div className={cn("flex flex-col items-center gap-8", className)}>
      {(category || tag) && (
        <h1 className="text-2xl font-semibold">{category ? category : `# ${tag}`}</h1>
      )}
      <div className="container grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 lg:gap-x-7 lg:gap-y-12 xl:grid-cols-3">
        {postPages?.pages.flatMap((page) => page.posts).map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
      <div ref={ref} className="h-1" />
    </div>
  );
};

export default PostList;
