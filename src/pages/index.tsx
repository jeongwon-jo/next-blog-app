import PostList from "@/components/PostList";
import { createClient } from "@/utils/supabase/server";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  const supabase = createClient({});

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", null, null],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const { data } = await supabase
        .from("Post")
        .select("*")
        .order("created_at", { ascending: false })
        .range(pageParam, pageParam + 4);

      return {
        posts: data ?? [],
        nextPage: data?.length === 5 ? pageParam + 5 : null,
      };
    },
    initialPageParam: 0,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60,
  };
};

export default function Home() {
  return <PostList />;
}
