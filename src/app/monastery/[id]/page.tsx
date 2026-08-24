"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MonasteryLegacyRedirect({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/heritage/${params.id}`);
  }, [params.id, router]);

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="text-center animate-pulse">
        <div className="w-10 h-10 rounded-full border-4 border-forest-700 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-stone-600">Redirecting to canonical heritage profile...</p>
      </div>
    </div>
  );
}
