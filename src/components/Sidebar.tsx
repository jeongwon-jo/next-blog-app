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
  return (
    <div
      className={cn(
        'absolute z-10 min-h-screen flex-col gap-6 border-r bg-white px-6 py-10 text-base lg:relative',
        isOpen ? 'flex' : 'hidden',
      )}
    >
      <div className="flex justify-end lg:hidden">
        <IconButton Icon={AiOutlineClose} onClick={close} />
      </div>
      <Link
        href={'/'}
        className="w-48 font-medium text-gray-600 hover:underline"
      >
        홈
      </Link>
      <Link
        href={'/tag'}
        className="w-48 font-medium text-gray-600 hover:underline"
      >
        태그
      </Link>
      <Link
        href={'/category/web-Development'}
        className="w-48 font-medium text-gray-600 hover:underline"
      >
        Web Development
      </Link>

      <div className="mt-10 flex items-center gap-4">
        <IconButton Icon={AiFillInstagram} component={Link} href={''} />
        <IconButton Icon={AiFillGithub} component={Link} href={''} />
      </div>
    </div>
  );
}

export default Sidebar;