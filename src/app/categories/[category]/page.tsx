import PostList from "@/components/post/PostList";
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

// 빌드 시점 호출
export const generateStaticParams = async () => {
  const { data } = await supabase.from("Post").select("category");
  const categories = Array.from(new Set(data?.flatMap((d) => d.category)));

  return categories.map((category) => ({category}));
};


export default async function CategoryPosts({params}:{ params: Promise<{category: string}> }) {
  const { category } = await params;

  const { data } = await supabase.from("Post").select("*").eq("category", category);

  return <PostList category={decodeURIComponent(category)} initialPosts={data?.map((post) => ({
    ...post, tags: JSON.parse(post.tags) as string[]
  }))} />;
}
