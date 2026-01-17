"use client";

import { motion } from "framer-motion";
import { PressItem } from "@/lib/types";
import { ArrowUpRight, Quote } from "lucide-react";

interface PressCardProps {
    item: PressItem;
    index: number;
}

export default function PressCard({ item, index }: PressCardProps) {
    // Deterministic rotation similar to ProjectCard
    const rotation = (index % 2 === 0 ? -1 : 1) * ((index % 3) * 0.3 + 0.3);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
            whileHover={{ y: -8, scale: 1.02, rotate: rotation }}
            className="group relative h-full w-full"
        >
            <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg relative z-20 cursor-pointer"
            >
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-white/5 border border-white/10 p-6 flex flex-col justify-between transition-colors duration-300 group-hover:bg-white/10 group-hover:border-white/20">

                    {/* Background decoration */}
                    <Quote className="absolute top-4 right-4 w-24 h-24 text-white/5 rotate-180 pointer-events-none group-hover:text-white/10 transition-colors" />

                    <div className="flex justify-between items-start z-10 pointer-events-none">
                        <span className="text-xs font-mono uppercase tracking-widest text-white/50 border border-white/20 px-2 py-1 rounded-full bg-black/20 backdrop-blur-sm group-hover:border-cyan-500/50 group-hover:text-cyan-400 transition-colors">
                            {item.publication}
                        </span>
                        <span className="text-xs font-mono text-white/40">
                            {item.date}
                        </span>
                    </div>

                    <div className="z-10 mt-auto mb-4 pointer-events-none">
                        <h3 className="text-xl font-bold font-blackout tracking-wide text-white mb-2 leading-tight line-clamp-3 group-hover:text-cyan-400 transition-colors">
                            "{item.title}"
                        </h3>
                        {/* Use line-clamp to ensure it fits in aspect-square */}
                        <p className="text-white/60 font-light text-sm italic line-clamp-4 leading-relaxed">
                            {item.excerpt}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 mt-0 group-hover:text-white group-hover:gap-3 transition-all z-10 pointer-events-none">
                        Read Review <ArrowUpRight className="w-3 h-3" />
                    </div>
                </div>
            </a>
        </motion.div>
    );
}
