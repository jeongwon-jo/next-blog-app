import PostWriteForm from "@/components/post/PostWriteForm";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function WritePage({params}:{ params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient(await cookies());

  const { data } = await supabase.from("Post").select("*").eq("id", Number(id)).single();
  const post = data ? { ...data, tags: JSON.parse(data.tags) as string[] } : null;
  const isEdit = !!post;

  return (
    <PostWriteForm post={post} isEdit={isEdit} />
  );
}
