"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/axios";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getToken } = useAuth();

  useEffect(() => {
    const verifyAndCreateOrder = async () => {
      try {
        const sessionId = searchParams.get("session_id");
        if (!sessionId) return;

        const token = await getToken();

        await api.post(
          "/payment/verify-session",
          { sessionId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        router.push("/orders");
      } catch (error) {
        console.error("Verification error", error);
      }
    };

    verifyAndCreateOrder();
  }, [getToken, router, searchParams]);

  return <div>Processing your order...</div>;
}