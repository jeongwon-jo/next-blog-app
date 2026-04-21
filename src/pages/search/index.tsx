import dynamic from "next/dynamic";

const SearchPage = dynamic(
  () => import("@/components/SearchPage").then((mod) => mod.SearchPage),
  { ssr: false }
)
export default function Search() {
  return <SearchPage />
}