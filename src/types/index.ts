import { Database } from "./supabase";

export type Post = Omit<Database['public']['Tables']['Post']['Row'], "tags"> & {
  tags: string[]
};
export type PostRequest = Database['public']['Tables']['Post']['Insert'];
export type PostUpdate = Database["public"]["Tables"]["Post"]["Update"];