import { NewsContent } from "@/components/news-content";

export default function News({ initialNews }: { initialNews?: any }) {
  return <NewsContent initialNews={initialNews} />;
}
