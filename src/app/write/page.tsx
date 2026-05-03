import PostWriteForm from "@/components/post/PostWriteForm";

export default async function WritePage() {
  const isEdit = false;

  return (
    <PostWriteForm isEdit={isEdit} />
  );
}
