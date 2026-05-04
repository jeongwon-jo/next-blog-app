import PostList from "@/components/post/PostList";
import { getCategories, getPosts } from "@/utils/fetch";
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

// 빌드 시점 호출
export const generateStaticParams = async () => {
  const categories = await getCategories()
  
  return categories.map((category) => ({category}));
};


export default async function CategoryPosts({params}:{ params: Promise<{category: string}> }) {
  const { category } = await params;
  const posts = await getPosts({category})

  return <PostList category={decodeURIComponent(category)} initialPosts={posts}/>;
}
