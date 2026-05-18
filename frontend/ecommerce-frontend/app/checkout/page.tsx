import { Suspense } from "react";
import CheckoutClient from "../Components/CheckOutClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutClient />
    </Suspense>
  );
}