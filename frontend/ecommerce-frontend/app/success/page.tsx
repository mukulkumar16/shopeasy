"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/axios";

export default function SuccessPage() {
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
          { headers: { Authorization: `Bearer ${token}` } }
        );

        router.push("/orders");

      } catch (error) {
        console.log("Verification error");
      }
    };

    verifyAndCreateOrder();
  }, []);

  return <div>Processing your order...</div>;
}