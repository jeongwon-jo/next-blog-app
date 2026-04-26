import logoImage from "@/assets/image/logo.png"
import Image from "next/image"
import Link from "next/link"
import { FC } from "react"
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai"
import { RiRobot2Line } from "react-icons/ri"
import IconButton from "./IconButton"

type HeaderProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen:boolean) => void
}

const Header: FC<HeaderProps> = ({isSidebarOpen, setIsSidebarOpen}) => {
  return (
    <header className="flex h-16 items-center justify-between border-b-2 border-pink-200 bg-white px-4 lg:h-20 lg:px-8">
      <IconButton
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        Icon={isSidebarOpen ? AiOutlineClose : AiOutlineMenu}
        className="text-pink-500 hover:text-pink-700"
      />
      <Link href={'/'}>
        {/* <h1 className="gradient-text text-3xl font-extrabold tracking-tight lg:text-4xl">
          JEONG1 LOG
        </h1> */}
        <Image src={logoImage} alt="JEONG1LOG" width={240} height={90} 
        className="object-contain" />
      </Link>
      <IconButton
        Icon={RiRobot2Line}
        component={Link}
        href={'/search'}
        className="text-pink-500 hover:text-pink-700"
      />
    </header>
  );
};

export default Header
