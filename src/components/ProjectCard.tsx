"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Project } from "@/lib/types";

interface ProjectCardProps {
    project: Project;
    index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
    // Deterministic rotation based on index to avoid hydration mismatch and useEffect
    const rotation = (index % 2 === 0 ? 1 : -1) * ((index % 3) * 0.5 + 0.5);

    const CardContent = (
        <div className="relative overflow-hidden rounded-lg bg-gray-900 shadow-xl transition-all duration-300 group-hover:shadow-2xl">
            <div className="relative aspect-video w-full overflow-hidden">
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-110 group-hover:grayscale-0 grayscale-[0.5]"
                />
            </div>

            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-6">
                <h3 className="font-syne text-2xl font-bold text-white mb-1 translate-y-4 transition-transform duration-300 group-hover:translate-y-0">{project.title}</h3>
                <p className="text-gray-300 text-sm font-light translate-y-4 transition-transform duration-300 delay-75 group-hover:translate-y-0">{project.role}</p>
                <div className="flex justify-between items-center mt-2 translate-y-4 transition-transform duration-300 delay-100 group-hover:translate-y-0">
                    <span className="text-xs text-gray-500 uppercase tracking-widest">{project.year}</span>
                    {project.link && (
                        <span className="text-xs text-white border border-white/30 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">View &rarr;</span>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
            whileHover={{ y: -8, scale: 1.02, rotate: rotation }}
            className={`group relative ${project.link ? 'cursor-pointer' : ''} will-change-transform`}
        >
            {project.link ? (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="block outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg">
                    {CardContent}
                </a>
            ) : (
                CardContent
            )}
        </motion.div>
    );
}
