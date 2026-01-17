"use client";

import { motion } from "framer-motion";
import pressData from "@/data/press.json";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function PressGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pressData.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-colors duration-300 flex flex-col justify-between h-full"
                >
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-xs font-mono uppercase tracking-widest text-white/50 border border-white/20 px-2 py-1 rounded-full">
                                {item.publication}
                            </span>
                            <span className="text-xs font-mono text-white/40">
                                {item.date}
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold font-blackout tracking-wide mb-4 text-white leading-none group-hover:text-cyan-400 transition-colors">
                            "{item.title}"
                        </h3>

                        <p className="text-white/70 font-light leading-relaxed mb-8 italic">
                            — {item.excerpt}
                        </p>
                    </div>

                    <Link href={item.link} target="_blank" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest hover:gap-4 transition-all text-white/60 hover:text-white">
                        Read Article <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
