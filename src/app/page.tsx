"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import TiledKineticBackground from "@/components/TiledKineticBackground";
import WaveText from "@/components/WaveText";

export default function Home() {
  const [backgroundText, setBackgroundText] = useState("PHILTERSOUP");

  const sections = [
    { title: "Media Composition", href: "/media-composition" },
    { title: "Creative Technologist", href: "/creative-technologist" },
    { title: "Audio Engineering", href: "/audio-engineering" },
    { title: "Discography", href: "/discography" },
  ];

  return (
    <main className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-black text-white selection:bg-red-500 selection:text-white">

      {/* Dynamic Background */}
      {/* Dynamic Background */}
      <TiledKineticBackground text={backgroundText} />

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
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              whileHover={{ scale: 1.05, filter: "blur(5px)", opacity: 0.8 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="font-blackout text-6xl md:text-9xl leading-none tracking-tighter text-white mix-blend-difference whitespace-nowrap drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] cursor-pointer"
            >
              PHILTER<span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">SOUP</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-blackout text-2xl text-gray-400 mt-6 tracking-[0.5em] uppercase"
            >
              Sound • Visuals • Form
            </motion.p>
          </div>
          {/* Navigation Stack */}
          <div className="flex flex-col gap-4 w-full max-w-4xl">
            {sections.map((section, index) => (
              <motion.div
                key={section.href}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                className="w-full"
                onMouseEnter={() => setBackgroundText(section.title.toUpperCase())}
                onMouseLeave={() => setBackgroundText("PHILTERSOUP")}
              >
                <Link
                  href={section.href}
                  className="group block w-full p-6 border-b border-white/20 transition-all duration-300 relative overflow-hidden flex justify-center items-center"
                >
                  <div className="relative z-10 text-center">
                    <h2 className="text-4xl md:text-7xl font-blackout text-white group-hover:text-red-600 transition-colors uppercase tracking-tight leading-none pointer-events-none">
                      {section.title}
                    </h2>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div >

      <div className="absolute bottom-4 text-xs text-gray-600 font-mono z-20">
        © {new Date().getFullYear()} philterSoup
      </div>
    </main >
  );
}
