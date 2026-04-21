import PostList from "@/components/PostList";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>jjeong1Log</title>
        <meta name="description" content="jjeong1의 개발 블로그" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="jjeong1Log" />
        <meta property="og:title" content="jjeong1Log" />
        <meta property="og:description" content="jjeong1의 개발 블로그" />
      </Head>
      <PostList />
    </>
  );
}