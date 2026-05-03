import PostWriteForm from "@/components/post/PostWriteForm";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function WritePage() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin");

  return <PostWriteForm isEdit={false} />;
}
