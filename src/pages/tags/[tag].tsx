import PostList from "@/components/PostList";
import { createClient } from "@/utils/supabase/server";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const supabase = createClient({});

export const getStaticPaths = async () => {
  const { data } = await supabase.from("Post").select("tags");
  const tags = Array.from(new Set(data?.flatMap((d) => JSON.parse(d.tags))));

  return {
    paths: tags.map((tag) => ({ params: { tag } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const tag = context.params?.tag as string;
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", null, tag],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const { data } = await supabase
        .from("Post")
        .select("*")
        .like("tags", `%${tag}%`)
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
      tag,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60,
  };
};

export default function TagPosts({ tag }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <PostList tag={tag} />;
}
