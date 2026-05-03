import { AdminForm } from "@/components/admin/AdminForm";
import { LoginForm } from "@/components/admin/LoginForm";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Admin() {
  const supabase = createClient(await cookies());
  const userResponse = await supabase.auth.getUser()

  return (
    <div className="container flex flex-col">
      <div className="m-auto w-full max-w-[420px]">
        {!!userResponse?.data.user ? (
        <AdminForm email={userResponse?.data?.user?.email}/>
      ) : (
        <LoginForm />
      )}
      </div>
      
    </div>
  )
}
