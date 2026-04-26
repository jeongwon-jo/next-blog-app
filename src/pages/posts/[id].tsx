import Button from "@/components/Button";
import { MarkdownViewer } from "@/components/Markdown";
import { Post } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

type PostProps = Post & { id: number };

export default function PostDtl({ id, title, category, tags, content, created_at, preview_image_url }: PostProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/");
    } else {
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <>
      <div className="pretendard container flex flex-col gap-8 pb-40">
        <h1 className="text-4xl font-bold">{title}</h1>
        <div className="flex flex-row items-center gap-2">
          <Link
            href={`/categories/${category}`}
            className="rounded-md bg-slate-800 px-2 py-1 text-sm text-white"
          >
            {category}
          </Link>
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="rounded-md bg-slate-200 px-2 py-1 text-sm text-slate-500"
            >
              {tag}
            </Link>
          ))}
          <div className="text-sm text-gray-500">
            {format(new Date(created_at), "yyyy.M.d HH:mm")}
          </div>
        </div>
        {preview_image_url && (
          <div className="flex justify-center">
            <Image
              src={preview_image_url}
              alt={title}
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto w-full max-w-[800px] object-contain"
            />
          </div>
        )}
        <MarkdownViewer source={content} className="w-full min-w-full" />

        <div className="flex justify-end gap-2 pt-4 [&>button]:max-w-[100px]">
          <Button variant="danger" onClick={handleDelete}>
            삭제
          </Button>
          <Button variant="default" onClick={() => router.push(`/write?id=${id}`)}>
            수정
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            목록
          </Button>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {
  const { id } = query;

  const supabase = createClient(req.cookies);
  const { data } = await supabase.from("Post").select("*").eq("id", Number(id));

  if (!data || !data[0]) return { notFound: true };

  const { title, category, tags, content, created_at, preview_image_url } = data[0];

  return {
    props: {
      id: Number(id),
      title,
      category,
      tags: JSON.parse(tags) as string[],
      content,
      created_at,
      preview_image_url,
      seo: {
        title,
        description: content.slice(0, 100),
        type: "article",
        image: preview_image_url ?? null,
      },
    },
  };
};
