"use client";

import dynamic from "next/dynamic";

const UBMap = dynamic(() => import("./UBmap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: 600, display: "grid", placeItems: "center" }}>
      Loading map...
    </div>
  ),
});

export default function MapClient() {
  return <UBMap />;
}
