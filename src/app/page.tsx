"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import TiledKineticBackground from "@/components/TiledKineticBackground";

export default function Home() {
  const sections = [
    { title: "Media Composition", href: "/media-composition", desc: "Music Production & Composition" },
    { title: "Creative Technologist", href: "/creative-technologist", desc: "Computational Art & Design" },
    { title: "Audio Engineering", href: "/audio-engineering", desc: "Recording & Mixing" },
    { title: "Discography", href: "/discography", desc: "Music & Video" },
  ];

  return (
    <main className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-black text-white selection:bg-red-500 selection:text-white">

      {/* Dynamic Background */}
      <TiledKineticBackground />

      {/* Subtle GIF overlay for texture (optional, mostly hidden by text/overlay) */}
      <div className="absolute inset-0 z-[-1] opacity-40 mix-blend-overlay">
        <Image
          src="/assets/images/philterSoup_splash.gif"
          alt="texture"
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="z-10 w-full max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col items-center justify-center min-h-screen py-12">

        {/* Central Overlay Box */}
        <div className="relative z-20 w-full max-w-4xl">
          {/* Title Block - Solid to pop against background */}
          <div className="mb-16 text-center">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="font-blackout text-6xl md:text-9xl leading-none tracking-tighter text-white mix-blend-difference whitespace-nowrap"
            >
              PHILTER<span className="text-red-600">SOUP</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-syne text-xl text-gray-400 mt-6 tracking-[0.5em] uppercase"
            >
              Sound • Visuals • Form
            </motion.p>
          </div>

          {/* Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {sections.map((section, index) => (
              <motion.div
                key={section.href}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              >
                <Link
                  href={section.href}
                  className="group block p-6 h-full border border-white/20 bg-black/60 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/50 rounded-xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-900/40 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <h2 className="text-2xl font-bold font-syne mb-2 text-white group-hover:text-red-400 transition-colors uppercase tracking-wide">
                        {section.title}
                      </h2>
                      <p className="text-sm text-gray-400 font-mono tracking-wider group-hover:text-gray-200 transition-colors">
                        {section.desc}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-end opacity-50 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-mono text-red-500">Explore &rarr;</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 text-xs text-gray-600 font-mono z-20">
        © {new Date().getFullYear()} philterSoup
      </div>
    </main>
  );
}
