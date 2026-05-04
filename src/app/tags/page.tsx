import { getTags } from "@/utils/fetch";
import Link from "next/link";

export default async function Tag() {
  const tags = await getTags()

  return (
    <div className="flex flex-col items-center gap-2 px-4 pb-24">
      <h1 className="gradient-text mb-8 text-center text-2xl font-extrabold">태그</h1>
      <div className="container flex flex-wrap justify-center gap-3">
        {tags?.map((tag) => (
          <Link key={tag} href={`/tags/${tag}`}
            className="rounded-full border-2 border-fuchsia-200 bg-fuchsia-50 px-4 py-1.5 text-sm font-semibold text-fuchsia-600 transition-all hover:border-fuchsia-400 hover:bg-fuchsia-100 hover:text-fuchsia-800">
            # {tag}
          </Link>
        ))}
      </div>
    </div>
  )
}
