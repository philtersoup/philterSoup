"use client";

import { GridItem } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import PressCard from "./PressCard";

interface MixedGridProps {
    items: GridItem[];
}

export default function MixedGrid({ items }: MixedGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4 md:p-12 max-w-[1600px] mx-auto">
            {items.map((item, index) => {
                if (item.type === 'project') {
                    return <ProjectCard key={item.id} project={item} index={index} aspect="square" />;
                } else {
                    return <PressCard key={item.id} item={item} index={index} />;
                }
            })}
        </div>
    );
}
