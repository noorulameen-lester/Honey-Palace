import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function BulkOrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-950 flex items-center justify-center py-12 px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessClient />
      </Suspense>
    </div>
  );
}
