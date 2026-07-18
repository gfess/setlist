import { Suspense } from "react";
import LogFlow from "@/components/LogFlow";

export default function LogPage() {
  return (
    <Suspense fallback={null}>
      <LogFlow />
    </Suspense>
  );
}
