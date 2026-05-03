import { Post } from "@/types";
import { cn } from "@/utils/style";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

export type PostCardProps = Post & {
  className?: string;
}

const PostCard: FC<PostCardProps> = ({
  id, title, content, preview_image_url, className
}) => {
  return (
    <Link href={`/posts/${id}`} className={cn("group rounded-2xl bg-white transition-all duration-200 hover:-translate-y-1", className)}>
      <div className="relative aspect-[1.8/1] w-full overflow-hidden rounded-xl border border-fuchsia-100 p-2">
        <Image src={preview_image_url ?? "/no_image.webp"} fill alt={title} sizes="360px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
      </div>
      <div className="px-1 py-2">
        <h2 className="text-md font-bold text-gray-900">{title}</h2>
        <p className="mt-1 line-clamp-3 text-sm text-gray-500">{content}</p>
      </div>
    </Link>
  )
}

export default PostCard
