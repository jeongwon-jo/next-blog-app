import Input from "@/components/Input";
import { MarkdownEditor } from "@/components/Markdown";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import ReactSelect from "react-select/creatable";

const supabase = createClient()

export default function Write() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null);

  const {data: existingCategories} = useQuery({
    queryKey: ["categories"],
    queryFn: async() => {
      const {data} = await supabase.from("Post").select("category")
      return Array.from(new Set(data?.map((d) => d.category)))
    }
  })

  const {data: existingTags} = useQuery({
    queryKey: ["tags"],
    queryFn: async() => {
      const {data} = await supabase.from("Post").select("tags")
      return Array.from(new Set(data?.flatMap((d) => JSON.parse(d.tags))))
    }
  })

  // 불필요한 리렌더링을 줄이기위해 ref 생성
  const titleRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("[]");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!titleRef. current?.value || titleRef.current.value.length === 0) return alert("제목을 입력해주세요.")
    if(category.length === 0) return alert('카테고리를 입력해주세요.');
    if(tags.length === 0) return alert("태그를 입력해주세요.")
    if(content.length === 0) return alert("내용을 입력해주세요.")

    const formData = new FormData()

    formData.append('title', titleRef.current?.value ?? "");
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('content', content);

    if (fileRef.current?.files?.[0]) {
      formData.append("preview_image", fileRef.current.files[0])
    }

    const response = await fetch("/api/posts", {
      method: "POST",
      // headers: {
      //   "Content-Type" : "multipart/form-data"
      // },
      body: formData
    })

    const data = await response.json()
    if (data.id) {
      router.push(`/posts/${data.id}`);
    }
  }

  return (
    <div className="container mx-auto flex flex-col px-4 pb-20 pt-12">
      <h1 className="mb-8 text-2xl font-medium">글 작성하기</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3">
          <Input
            type="text"
            placeholder="제목"
            ref={titleRef}
          />
          <Input
            type="file"
            accept="image/*"
            ref={fileRef}
          />
          <ReactSelect
            options={existingCategories?.map((category) => ({
              label: category,
              value: category,
            }))}
            placeholder="카테고리"
            isMulti={false}
            onChange={(e) => e && setCategory(e.value)}
          />
          <ReactSelect
            options={existingTags?.map((tag) => ({
              label: tag,
              value: tag,
            }))}
            placeholder="태그"
            isMulti={true}
            onChange={(e) =>
              e && setTags(JSON.stringify(e.map((e) => e.value)))
            }
          />
          <MarkdownEditor
            height={500}
            value={content}
            onChange={(s) => setContent(s ?? '')}
          />
        </div>
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-slate-600 py-2 text-white hover:bg-slate-700"
        >
          작성하기
        </button>
      </form>
    </div>
  );
}

// export const getServerSideProps: GetServerSideProps<WriteProps> = async({req}) => {
//   const supabase = createClient(req.cookies)
//   const {data} = await supabase.from("Post").select("category, tags")

//   return {
//     props: {
//       existingCategories: Array.from(new Set(data?.map((d) => d.category))) ?? [],
//       existingTags: Array.from(new Set(data?.flatMap((d) => JSON.parse(d.tags)))) ?? [],
//     },
//   };
// }