import { UserResponse } from "@supabase/supabase-js";
import Link from "next/link";
import { FC, useState } from "react";
import { FaPencilAlt, FaRegUser } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import IconButton from "./IconButton";

const Footer: FC = () => {
  const [userResponse, setUserResponce] = useState<UserResponse>()
  
  return (
    <footer className="flex justify-between border-t-2 border-pink-100 bg-fuchsia-50 p-4 px-6 font-medium">
      <div className="flex items-center gap-2 lg:gap-4">
        <div className="text-xs text-fuchsia-600 lg:text-sm">
          프론트엔드 엔지니어 조정원
        </div>
      </div>
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="flex items-center gap-2">
          <div className="pr-1 text-sm font-bold text-purple-700 lg:text-base">
            {userResponse?.data.user ? "Login" : "JEONG1" }</div>
            <IconButton
              Icon={userResponse?.data.user ? FiLogIn : FaRegUser}
              iconClassName={userResponse?.data.user ? "" : "!size-5"}
              component={Link}
              href={'/admin'}
              className="text-fuchsia-400 hover:text-fuchsia-600"
            />
        </div>
        <IconButton
          Icon={FaPencilAlt}
          component={Link}
          href={'/write'}
          iconClassName="!size-5"
          className="text-fuchsia-400 hover:text-fuchsia-600"
        />
      </div>
    </footer>
  );
}

export default Footer
