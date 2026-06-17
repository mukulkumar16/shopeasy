import { Suspense } from "react";
import SuccessClient from "@/app/Components/SuccessClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Processing your order...</div>}>
      <SuccessClient />
    </Suspense>
  );
}