"use client"
import * as React from "react";
import NavBar from "@/components/ui/navbar";
import Orb from "@/components/Orb";

export default function Home() {
  return (
    <div className="bg-background" style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Orb
        hoverIntensity={1.2}
        rotateOnHover={true}
        hue={0}
        forceHoverState={false}
      />

      <NavBar />

      <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-7xl font-black text-center">SEOKMIN.DEV</h1>


    </div>
  );
}
