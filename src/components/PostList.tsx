import PostCard from "@/components/PostCard";
import { cn } from "@/utils/style";
import { createClient } from "@/utils/supabase/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FC, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const supabase = createClient()

type PostListProps = {
  category?: string;
  tag?: string;
  className?: string;
}

const PostList:FC<PostListProps> = ({category, tag, className}) => {
  const {ref, inView }= useInView()
  const {data: postPages, fetchNextPage, hasNextPage} = useInfiniteQuery({
    queryKey: ["posts", category, tag],
    queryFn: async ({pageParam}) => {
      let request = supabase.from("Post").select("*");

      if(category) request = request.eq("category", category)
      if(tag) request = request.like("tags", `%${tag}%`)
      
      const {data} = await request.order("created_at", {ascending: false})
      .range(pageParam, pageParam+4)

      if(!data) 
        return {
          posts: [],
          nextPage: null
        };

      return {posts:data, nextPage:data.length === 5 ? pageParam + 5 : null};
    },
    initialPageParam:0,
    getNextPageParam: (lastPage) => lastPage.nextPage
  })

  useEffect(() => {
    if(inView && hasNextPage) fetchNextPage()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  return (
    <div className={cn("flex flex-col items-center gap-8", className)}>
      {(category || tag)&& (
        <h1 className="text-2xl font-semibold">{category ? category : `# ${tag}`}</h1>
      )}
      <div className="container grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 lg:gap-x-7 lg:gap-y-12 xl:grid-cols-3">
        {postPages?.pages.flatMap((posts) => posts.posts).map((post) => <PostCard key={post.id} {...post} />)}
      </div>
      <div ref={ref} className="h-1"></div>
    </div>
    
  );
}

export default PostList