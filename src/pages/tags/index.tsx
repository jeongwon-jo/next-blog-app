import { useTags } from "@/utils/hooks"
import Link from "next/link"

export default function Tag() {
  const {data: existingTags} = useTags()
  
  return (
    <div className="flex flex-col items-center gap-2 px-4 pb-24">
      <h1 className="mb-8 text-center text-2xl font-semibold">태그</h1>
      <div className="container flex flex-wrap justify-center gap-2">
        {existingTags?.map((tag) => (
          <Link key={tag} href={`/tags/${tag}`} 
          className="text-xl text-gray-500 underline hover:text-gray-700">
          {tag}
          </Link>
        ))}
      </div>
    </div>
  )
}