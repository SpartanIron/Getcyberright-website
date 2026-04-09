import { Suspense } from "react";
import { StructuredData } from "@/components/structured-data";
import type { BreadcrumbData } from "@/components/structured-data";
import { ResourcesContent } from "@/components/resources-content";

const breadcrumbs: BreadcrumbData = {
  type: "BreadcrumbList",
  items: [
    { name: "Home", url: "https://www.getcyberright.com/" },
    { name: "Resources", url: "https://www.getcyberright.com/resources" },
  ],
};

export default function Resources() {
  return (
    <>
      <StructuredData data={breadcrumbs} />
      <Suspense>
        <ResourcesContent />
      </Suspense>
    </>
  );
}
