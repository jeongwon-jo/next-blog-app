import { useCategories } from "@/utils/hooks";
import { cn } from "@/utils/style";
import Link from "next/link";
import { FC } from "react";
import { AiFillGithub, AiFillInstagram, AiOutlineClose } from "react-icons/ai";
import IconButton from "./IconButton";

type SidebarProps = {
  close: () => void;
  isOpen: boolean;
}

const Sidebar:FC<SidebarProps> = ({close, isOpen}) => {
  const {data: existingCategories} = useCategories()

  return (
    <aside
      className={cn(
        'absolute left-0 top-3 z-10 flex h-[calc(100dvh-24px)] min-w-[240px] flex-col gap-6 rounded-md border-2 border-pink-400 bg-white p-3 text-base',
        'transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-3' : '-translate-x-full',
      )}
    >
      <div className="flex justify-end">
        <IconButton Icon={AiOutlineClose} onClick={close} className="text-pink-400 hover:text-pink-600" />
      </div>
      <Link
        href={'/'}
        className="w-48 px-2 font-semibold text-fuchsia-700 transition-colors hover:text-pink-500"
      >
        홈
      </Link>
      <Link
        href={'/tags'}
        className="w-48 px-2 font-semibold text-fuchsia-700 transition-colors hover:text-pink-500"
      >
        태그
      </Link>
      {existingCategories?.map((category) => (
        <Link
          key={category}
          href={`/categories/${category}`}
          className="w-48 px-2 font-semibold text-fuchsia-700 transition-colors hover:text-pink-500"
        >
          {category}
        </Link>
      ))}
      <div className="mt-5 flex items-center gap-4">
        <IconButton Icon={AiFillInstagram} component={Link} href={''} className="text-fuchsia-500 hover:text-pink-500" />
        <IconButton Icon={AiFillGithub} component={Link} href={''} className="text-fuchsia-500 hover:text-pink-500" />
      </div>
    </aside>
  );
}

export default Sidebar;
