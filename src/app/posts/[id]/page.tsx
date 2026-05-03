import PostDetail from "@/components/post/PostDetail";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

// 빌드 시점 호출
export const generateStaticParams = async () => {
  const supabase = createClient();

  const { data } = await supabase.from("Post").select("id");
  return data?.map(({id}) => ({params: {id: id.toString()}})) ?? [];
};

export default async function PostDtl({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient(await cookies());
  const { data } = await supabase.from("Post").select("*").eq("id", Number(id)).single();

  if (!data) return notFound();
  const post = { ...data, tags: JSON.parse(data.tags) as string[] };

  return (
    <PostDetail post={post} />
  );
}