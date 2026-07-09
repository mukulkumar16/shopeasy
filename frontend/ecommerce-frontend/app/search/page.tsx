import { Suspense } from "react";
import SearchClient from "@/app/Components/SearchClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>}>
      <SearchClient />
    </Suspense>
  );
}