'use client'
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import api from "@/lib/axios";

export default function SyncUser() {
  const { user, isLoaded } = useUser();
  const hasSynced = useRef(false);

useEffect(() => {
  if (!isLoaded || !user || hasSynced.current) return;

  hasSynced.current = true; // ✅ lock immediately

  const syncUser = async () => {
    try {
      await api.post("/users/sync", {
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
      });

      console.log("✅ User synced");
    } catch (error) {
      console.error("❌ User sync failed", error);
    }
  };

  syncUser();
}, [user, isLoaded]);

  return null;
}