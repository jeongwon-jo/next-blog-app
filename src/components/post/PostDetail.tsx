"use client"

import { Post } from "@/types";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import { MarkdownViewer } from "../ui/Markdown";

interface IPostDetail {
  post: Post | null;
}

export default function PostDetail({post}: IPostDetail) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/posts/${post?.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/");
    } else {
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <>
      <div className="pretendard container flex flex-col gap-8 pb-40">
        <h1 className="text-4xl font-bold">{post?.title}</h1>
        <div className="flex flex-row items-center gap-2">
          <Link
            href={`/categories/${post?.category}`}
            className="rounded-md bg-slate-800 px-2 py-1 text-sm text-white"
          >
            {post?.category}
          </Link>
          {post?.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="rounded-md bg-slate-200 px-2 py-1 text-sm text-slate-500"
            >
              {tag}
            </Link>
          ))}
          <div className="text-sm text-gray-500">
            {format(new Date(post?.created_at ?? ""), "yyyy.M.d HH:mm")}
          </div>
        </div>
        {post?.preview_image_url && (
          <div className="flex justify-center">
            <Image
              src={post?.preview_image_url}
              alt={post?.title}
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto w-full max-w-[800px] object-contain"
            />
          </div>
        )}
        <MarkdownViewer source={post?.content} className="w-full min-w-full" />

        <div className="flex justify-end gap-2 pt-4 [&>button]:max-w-[100px]">
          <Button variant="danger" onClick={handleDelete}>
            삭제
          </Button>
          <Button variant="default" onClick={() => router.push(`/write/${post?.id}`)}>
            수정
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            목록
          </Button>
        </div>
      </div>
    </>
  )
}