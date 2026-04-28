import PostList from "@/components/PostList";
import { createClient } from "@/utils/supabase/server";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const supabase = createClient({});

export const getStaticPaths = async () => {
  const { data } = await supabase.from("Post").select("category");
  const categories = Array.from(new Set(data?.map((d) => d.category)));

  return {
    paths: categories.map((category) => ({ params: { category } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const category = context.params?.category as string;
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", category, null],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const { data } = await supabase
        .from("Post")
        .select("*")
        .eq("category", category)
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
      category,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60,
  };
};

export default function CategoryPosts({ category }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <PostList category={category} />;
}
