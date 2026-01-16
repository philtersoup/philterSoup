"use client";

import { Project } from "@/lib/types";
import ProjectCard from "./ProjectCard";

interface CollageGridProps {
    projects: Project[];
}

export default function CollageGrid({ projects }: CollageGridProps) {
    // Sort projects by year descending
    const sortedProjects = [...projects].sort((a, b) => parseInt(b.year) - parseInt(a.year));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4 md:p-12 max-w-[1600px] mx-auto">
            {sortedProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
            ))}
        </div>
    );
}
