"use client"
import * as React from "react";
import { useTheme } from "next-themes";
import LightRays from "@/components/LightRays";
import NavBar from "@/components/ui/navbar";

export default function Home() {
  const { setTheme } = useTheme();

  return (
    <div className="bg-background" style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <LightRays
        raysOrigin="top-center"
        raysColor="#ffffff"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.1}
        distortion={0.05}
        className="custom-rays"
      />

      <NavBar />
    </div>
  );
}
