import { StructuredData } from "@/components/structured-data";
import type { CourseData, BreadcrumbData } from "@/components/structured-data";
import { TrainingContent } from "@/components/training-content";

const trainingCourseSchema: CourseData = {
  type: "Course",
  name: "GetCyberRight Cybersecurity Training Academy",
  description: "Free, comprehensive cybersecurity training for families, kids, seniors, educators, and small businesses. Learn to protect yourself and your loved ones online.",
  provider: "GetCyberRight",
  url: "https://www.getcyberright.com/training",
  isAccessibleForFree: true,
};

const trainingBreadcrumbs: BreadcrumbData = {
  type: "BreadcrumbList",
  items: [
    { name: "Home", url: "https://www.getcyberright.com/" },
    { name: "Training Academy", url: "https://www.getcyberright.com/training" },
  ],
};

export default function Training({ initialPaths }: { initialPaths?: any[] }) {
  return (
    <>
      <StructuredData data={[trainingCourseSchema, trainingBreadcrumbs]} />
      <TrainingContent initialPaths={initialPaths} />
    </>
  );
}
