import PostList from "@/components/post/PostList";
import { getPosts, getTags } from "@/utils/fetch";

// 빌드 시점 호출
export const generateStaticParams = async () => {
  const tags = await getTags()
  return tags.map((tag) => ({tag}));
};

export default async function TagPosts({params}:{ params: Promise<{tag: string}> }) {
  const {tag} = await params;
  const posts =  await getPosts({tag})
  
  return <PostList tag={decodeURIComponent(tag)} initialPosts={posts} />;
}
