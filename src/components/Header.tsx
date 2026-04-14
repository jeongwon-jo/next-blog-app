import Link from "next/link"
import { FC } from "react"
import { AiOutlineMenu } from "react-icons/ai"
import { BsRobot } from "react-icons/bs"

const Header:FC = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b px-4 lg:h-20 lg:px-10">
      <button className="p-2">
        <AiOutlineMenu className="size-5 lg:size-6" />
      </button>
      <Link href={'/'}>
        <h1 className="text-3xl font-semibold text-slate-600 lg:text-4xl">JEONG1 LOG</h1>
      </Link>
      <Link href={'/posts'}>
        <BsRobot className="size-5 lg:size-6" />
      </Link>
    </header>
  );
}

export default Header