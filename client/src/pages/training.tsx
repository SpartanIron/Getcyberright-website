import { TrainingContent } from "@/components/training-content";
import type { LearningPath } from "@shared/schema";

export default function Training({ initialPaths }: { initialPaths?: LearningPath[] }) {
  return <TrainingContent initialPaths={initialPaths} />;
}
