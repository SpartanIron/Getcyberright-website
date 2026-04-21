import { NewsContent, type TracksResponse } from "@/components/news-content";

export default function News({
  initialTracks,
}: {
  initialTracks?: TracksResponse | null;
}) {
  return <NewsContent initialTracks={initialTracks} />;
}
