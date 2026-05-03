"use client"

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";

interface IAdminForm {
  email: string | undefined;
}

export const AdminForm = ({email}: IAdminForm) => {
  const supabase = createClient();
  const router = useRouter();
  
  return (
    <div className="flex flex-col gap-2">
      <div className="mb-8 text-center text-purple-800">
        <b className="text-fuchsia-600">{email}</b>님으로 로그인하셨습니다.
      </div>
      <Button type="submit" className="w-full" onClick={() => router.push("/write")}>글쓰러 가기</Button>
      <Button type="button" className="w-full" onClick={() => {fetch("/api/posts", {method: "DELETE"})}}>테스트 글 삭제</Button>
      <Button type="submit" variant="outline" className="mt-2 w-full" onClick={() => {
        supabase.auth.signOut();
        router.push("/")
      }}>로그아웃</Button>
    </div>
  )
}