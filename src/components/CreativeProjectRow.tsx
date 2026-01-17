"use client";

import { useState } from "react";
import Image from "next/image";
import { Project } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

interface CreativeProjectRowProps {
    project: Project;
    index: number;
}

export default function CreativeProjectRow({ project, index }: CreativeProjectRowProps) {
    // Collect all images: primary first, then the array from 'images' if it exists.
    // Filter out duplicates if the primary image is also in the list.
    const allImages = [project.image, ...(project.images || [])];
    const uniqueImages = Array.from(new Set(allImages));

    const [selectedImage, setSelectedImage] = useState(uniqueImages[0]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32 items-start"
        >
            {/* Left Column: Context & Text */}
            <div className="space-y-8 order-2 lg:order-1">
                <div>
                    <h2 className="text-4xl md:text-6xl font-blackout text-white mb-2">{project.title}</h2>
                    <p className="text-red-500 font-mono text-sm uppercase tracking-widest">{project.year}</p>
                </div>

                <div className="prose prose-invert prose-lg text-gray-400 font-light leading-relaxed">
                    <p>{project.role}</p>
                </div>

                {project.link && (
                    <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block border-b border-red-500 text-white pb-1 hover:text-red-500 hover:border-white transition-colors font-mono text-sm uppercase tracking-widest"
                    >
                        View Project &rarr;
                    </a>
                )}

                {/* Thumbnails if multiple images exist */}
                {uniqueImages.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-4 pt-4 no-scrollbar">
                        {uniqueImages.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImage(img)}
                                className={`relative flex-shrink-0 w-24 h-16 md:w-32 md:h-20 border-2 transition-all duration-300 ${selectedImage === img ? 'border-red-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                            >
                                <Image
                                    src={img}
                                    alt={`${project.title} thumbnail ${i + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Column: Main Image Display */}
            <div className="relative aspect-video w-full bg-gray-900/50 order-1 lg:order-2 overflow-hidden rounded-sm border border-white/10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedImage}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src={selectedImage}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
