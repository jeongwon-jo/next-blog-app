
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { FC } from "react";
import { FaPencilAlt } from "react-icons/fa";
import IconButton from "../ui/IconButton";
import UserStatus from "./UserStatus";

const Footer: FC = async () => {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <footer className="flex justify-between border-t-2 border-pink-100 bg-fuchsia-50 p-4 px-6 font-medium">
      <div className="flex items-center gap-2 lg:gap-4">
        <div className="text-xs text-fuchsia-600 lg:text-sm">
          프론트엔드 엔지니어 조정원
        </div>
      </div>
      <div className="flex items-center gap-2 lg:gap-3">
        <UserStatus initialUser={user} />
        <IconButton
          Icon={FaPencilAlt}
          component={Link}
          label="writeLink"
          href={'/write'}
          iconClassName="!size-5"
          className="text-fuchsia-400 hover:text-fuchsia-600"
        />
      </div>
    </footer>
  );
}

export default Footer;
