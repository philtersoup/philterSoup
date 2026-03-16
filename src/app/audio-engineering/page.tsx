
import CollageGrid from "@/components/CollageGrid";
import { Project } from "@/lib/types";
import allProjects from "@/data/projects.json";

function getProjects(): Project[] {
    const projects = allProjects as Project[];
    return projects.filter(p => p.category === 'Mixing');
}

export default function AudioEngineeringPage() {
    const projects = getProjects();


    return (
        <main className="min-h-screen bg-black">
            <header className="pt-24 pb-12 px-4 md:px-12">
                <h1 className="font-syne text-4xl md:text-8xl font-bold text-white mb-4">Audio Engineering</h1>
                <p className="text-gray-400 text-xl font-light max-w-2xl">Recording & Mixing</p>
            </header>
            <CollageGrid projects={projects} aspect="square" />
        </main>
    );
}
