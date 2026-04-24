import { Post } from "@/types";
import { cn } from "@/utils/style";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

export type PostCardProps  = Post & {
  className?: string;
}

const PostCard: FC<PostCardProps> = ({
  id, title, content, preview_image_url, className
}) => {
  return (
    <Link href={`/posts/${id}`} className={cn("bg-white", className)}>
      <div className="relative aspect-[1.8/1] w-full overflow-hidden rounded-md border border-gray-300 p-2">
        <Image src={preview_image_url ?? "/no_image.webp"} fill alt={title} sizes="360px" className="object-cover" />
      </div>
      <div className="px-1 py-2">
        <h2 className="text-md font-semibold">{title}</h2>
        <p className="mt-1 line-clamp-3 text-sm text-gray-500">{content}</p>
      </div>      
    </Link>
  )
}

export default PostCard