import { NewsContent, type NewsResponse } from "@/components/news-content";

export default function News({ initialNews }: { initialNews?: NewsResponse | null }) {
  return <NewsContent initialNews={initialNews} />;
}
