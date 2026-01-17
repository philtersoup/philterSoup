"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Project } from "@/lib/types";

interface ProjectCardProps {
    project: Project;
    index: number;
    aspect?: "video" | "square";
}

export default function ProjectCard({ project, index, aspect = "video" }: ProjectCardProps) {
    // Deterministic rotation based on index
    const rotation = (index % 2 === 0 ? 1 : -1) * ((index % 3) * 0.5 + 0.5);

    const aspectRatioClass = aspect === "square" ? "aspect-square" : "aspect-video";

    const CardContent = (
        <div className="relative overflow-hidden rounded-lg bg-gray-900 shadow-xl transition-all duration-300 group-hover:shadow-2xl h-full">
            <div className={`relative ${aspectRatioClass} w-full overflow-hidden`}>
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-110 group-hover:grayscale-0 grayscale-[0.5]"
                />
            </div>

            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent opacity-100 md:opacity-0 transition-opacity duration-300 md:group-hover:opacity-100 flex flex-col justify-end p-4 md:p-6 pointer-events-none">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:translate-y-4 transition-transform duration-300 md:group-hover:translate-y-0 text-shadow-sm">{project.title}</h3>
                <div className="md:translate-y-4 transition-transform duration-300 delay-75 md:group-hover:translate-y-0">
                    <p className="text-gray-300 text-xs md:text-sm font-light">{project.role}</p>
                    {project.composer && (
                        <p className="text-gray-400 text-[10px] md:text-xs font-mono mt-0.5">Composer - {project.composer}</p>
                    )}
                </div>
                <div className="flex justify-between items-center mt-2 md:translate-y-4 transition-transform duration-300 delay-100 md:group-hover:translate-y-0">
                    <span className="text-xs md:text-sm font-blackout text-gray-500 uppercase tracking-widest">{project.year}</span>
                    {project.link && (
                        <span className="text-xs md:text-sm font-blackout text-white border border-white/30 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">View &rarr;</span>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
            whileHover={{ y: -8, scale: 1.02, rotate: rotation }}
            className={`group relative ${project.link ? 'cursor-pointer' : ''} will-change-transform h-full`}
        >
            {project.link ? (
                <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg h-full relative z-10"
                >
                    {CardContent}
                </a>
            ) : (
                CardContent
            )}
        </motion.div>
    );
}
