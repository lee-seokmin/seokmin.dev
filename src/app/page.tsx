"use client"
import * as React from "react";
import NavBar from "@/components/navbar";
import Orb from "@/components/Orb";
import Footer from "@/components/footer";

const posts = [
  {
    "title": "Post 1",
    "date": "2025-10-11",
    "slug": "post-1"
  },
  {
    "title": "Post 2",
    "date": "2025-10-12",
    "slug": "post-2"
  }
]

export default function Home() {
  return (
    <div className="bg-background space-y-24 px-6" style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Orb
        hoverIntensity={1.2}
        rotateOnHover={true}
        hue={0}
        forceHoverState={false}
      />

      <NavBar />

      <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl md:text-7xl font-black text-center">SEOKMIN.DEV</h1>

      <div className="max-w-6xl mx-auto space-y-2">
        <h2 className="text-2xl font-bold">Recent Posts</h2>

        <div className="grid grid-cols-2 gap-6">
          {posts.map((post) => (
            <div key={post.slug} className="bg-transparent hover:bg-card border border-border rounded-lg overflow-hidden shadow-lg transition-all duration-200 cursor-pointer">
              <div className="p-4">
                <h3 className="text-lg text-foreground font-semibold">{post.title}</h3>
                <p className="text-sm text-muted-foreground">{post.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
