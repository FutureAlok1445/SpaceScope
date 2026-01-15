"use client";

import { BootSequence } from "@/components/3d/BootSequence";
import { useState } from "react";

export default function Loading() {
  const [bootComplete, setBootComplete] = useState(false);

  if (bootComplete) {
    return null;
  }

  return <BootSequence onComplete={() => setBootComplete(true)} />;
}

