import { MarkdownViewer } from "@/components/Markdown";
import { cn } from "@/utils/style";
import { FC } from "react";
import { BsFillPersonFill, BsRobot } from "react-icons/bs";
import PostCard, { PostCardProps } from "./PostCard";

export type MessageProps = {
  content: string;
  role: "user" | "assistant";
  posts?: Omit<PostCardProps, "className">[];
}

const Message: FC<MessageProps> = ({ content, role, posts }) => {
  return (
    <div className={cn("p-4 lg:p-6", role === "user" ? "bg-white" : "bg-fuchsia-50")}>
      <div className="container flex items-start gap-3 text-sm lg:gap-4">
        {role === "user"
          ? <BsFillPersonFill className="mt-1 size-6 shrink-0 text-purple-500" />
          : <BsRobot className="mt-1 size-6 shrink-0 text-fuchsia-500" />
        }
        <div className="flex min-w-0 flex-1 flex-col items-start">
          {role === "assistant" ? (
            <MarkdownViewer source={content} className="!bg-transparent text-purple-900" />
          ) : (
            <div className="whitespace-pre-wrap text-purple-900">{content}</div>
          )}
          {posts && posts.length > 0 && (
            <div className="mt-4 flex justify-start">
              {posts.map((post) => (
                <PostCard {...post} key={post.id} className="w-[300px] border border-fuchsia-100" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;
