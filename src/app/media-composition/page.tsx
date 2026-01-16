
import CollageGrid from "@/components/CollageGrid";
import { Project } from "@/lib/types";
import allProjects from "@/data/projects.json";

function getProjects(): Project[] {
    const projects = allProjects as Project[];
    return projects.filter(p => p.category === 'Production');
}

export default function MediaCompositionPage() {
    const projects = getProjects();


    return (
        <main className="min-h-screen bg-black">
            <header className="pt-32 pb-24 px-4 md:px-12 max-w-[1600px] mx-auto">
                <h1 className="font-blackout text-8xl md:text-[8rem] leading-[0.85] font-bold text-white mb-8">
                    MEDIA<br /><span className="text-red-600 outline-text">COMPOSITION</span>
                </h1>
                <p className="text-gray-400 text-xl font-light max-w-2xl border-l-2 border-red-600 pl-6">
                    Music Production & Composition
                </p>
            </header>
            <CollageGrid projects={projects} />
        </main>
    );
}
