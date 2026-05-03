import PostList from "@/components/post/PostList";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// 빌드 시점 호출
export const generateStaticParams = async () => {
  const supabase = createClient();

  const { data } = await supabase.from("Post").select("tags");
  const tags = Array.from(new Set(data?.flatMap((d) => JSON.parse(d.tags))));

  return tags.map((tag) => ({tag}));
};

export default async function TagPosts({params}:{ params: Promise<{tag: string}> }) {
  const {tag} = await params;
  const supabase = createClient(await cookies());
  
  const { data } = await supabase.from("Post").select("*").like("tags", `%${tag}%`);
  
  return <PostList tag={decodeURIComponent(tag)} initialPosts={data?.map((post) => ({
    ...post, tags: JSON.parse(post.tags) as string[]
  }))} />;
}
