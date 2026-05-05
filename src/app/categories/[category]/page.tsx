import PostList from "@/components/post/PostList";
import { getCategories, getPosts } from "@/utils/fetch";
import { Metadata } from "next";

export const generateMetadata = async ({ params }: { params: Promise<{ category: string }> }) : Promise<Metadata> => {
  const { category } = await params;
  
  return {
    title: `JEONG1LOG - ${decodeURIComponent(category)}`,
    description: "정원의 개발 블로그",
  }
}

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
