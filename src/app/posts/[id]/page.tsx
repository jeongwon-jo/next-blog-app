import PostDetail from "@/components/post/PostDetail";
import { getPost } from "@/utils/fetch";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

// 빌드 시점 호출
export const generateStaticParams = async () => {
  const supabase = createClient();

  const { data } = await supabase.from("Post").select("id");
  return data?.map(({id}) => ({params: {id: id.toString()}})) ?? [];
};

export default async function PostDtl({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id)
  if (!post) return notFound();
  return (
    <PostDetail post={post} />
  );
}