import { Suspense } from "react";
import SearchClient from "@/app/Components/SearchClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Searching...</div>}>
      <SearchClient />
    </Suspense>
  );
}