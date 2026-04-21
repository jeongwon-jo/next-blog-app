import Button from "@/components/Button";
import Input from "@/components/Input";
import { MarkdownEditor } from "@/components/Markdown";
import { Post } from "@/types";
import { useCategories, useTags } from "@/utils/hooks";
import { createClient } from "@/utils/supabase/server";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import ReactSelect from "react-select/creatable";

type WriteProps = {
  post?: Post & { id: number };
};

export default function Write({ post }: WriteProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const isEdit = !!post;

  const { data: existingCategories } = useCategories();
  const { data: existingTags } = useTags();

  const titleRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState(post?.category ?? "");
  const [tags, setTags] = useState(post ? JSON.stringify(post.tags) : "[]");
  const [content, setContent] = useState(post?.content ?? "");
  const [keepImage, setKeepImage] = useState(true);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!titleRef.current?.value || titleRef.current.value.length === 0)
      return alert("제목을 입력해주세요.");
    if (category.length === 0) return alert("카테고리를 입력해주세요.");
    if (content.length === 0) return alert("내용을 입력해주세요.");

    const formData = new FormData();
    formData.append("title", titleRef.current.value);
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("content", content);

    if (fileRef.current?.files?.[0]) {
      formData.append("preview_image", fileRef.current.files[0]);
    } else if (isEdit && !keepImage) {
      formData.append("remove_image", "true");
    }

    if (isEdit) {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        router.push(`/posts/${post.id}`);
      } else {
        alert("수정에 실패했습니다.");
      }
    } else {
      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.id) {
        router.push(`/posts/${data.id}`);
      }
    }
  };

  return (
    <div className="container flex flex-col">
      <h1 className="mb-8 text-center text-2xl font-semibold">{isEdit ? "글 수정하기" : "글 작성하기"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3">
          <Input type="text" placeholder="제목" ref={titleRef} defaultValue={post?.title} />
          {post?.preview_image_url && keepImage && (
            <div className="relative h-48 w-full overflow-hidden rounded-md border border-gray-300">
              <Image src={post.preview_image_url} fill alt="현재 이미지" className="object-cover" sizes="800px" />
              <button
                type="button"
                onClick={() => setKeepImage(false)}
                className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                ✕
              </button>
            </div>
          )}
          <Input type="file" accept="image/*" ref={fileRef} />
          <ReactSelect
            options={existingCategories?.map((c) => ({ label: c, value: c }))}
            placeholder="카테고리"
            isMulti={false}
            defaultValue={post ? { label: post.category, value: post.category } : undefined}
            onChange={(e) => e && setCategory(e.value)}
          />
          <ReactSelect
            options={existingTags?.map((tag) => ({ label: tag, value: tag }))}
            placeholder="태그"
            isMulti={true}
            defaultValue={post?.tags.map((t) => ({ label: t, value: t }))}
            onChange={(e) => e && setTags(JSON.stringify(e.map((e) => e.value)))}
          />
          <MarkdownEditor
            height={500}
            value={content}
            onChange={(s) => setContent(s ?? "")}
          />
        </div>
        <Button type="submit" className="mt-4 w-full">
          {isEdit ? "수정하기" : "작성하기"}
        </Button>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<WriteProps> = async ({ query, req }) => {
  const { id } = query;
  if (!id) return { props: {} };

  const supabase = createClient(req.cookies);
  const { data } = await supabase.from("Post").select("*").eq("id", Number(id)).single();

  if (!data) return { notFound: true };

  return {
    props: {
      post: {
        ...data,
        tags: JSON.parse(data.tags) as string[],
      },
    },
  };
};
