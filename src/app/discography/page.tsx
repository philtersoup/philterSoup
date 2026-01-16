
import { promises as fs } from 'fs';
import path from 'path';
import CollageGrid from "@/components/CollageGrid";
import { Project } from "@/lib/types";

async function getProjects() {
    const filePath = path.join(process.cwd(), 'src/data/projects.json');
    const jsonData = await fs.readFile(filePath, 'utf-8');
    const projects: Project[] = JSON.parse(jsonData);
    return projects.filter(p => p.category === 'Discography');
}

export default async function DiscographyPage() {
    const projects = await getProjects();

    return (
        <main className="min-h-screen bg-black">
            <header className="pt-24 pb-12 px-4 md:px-12">
                <h1 className="font-syne text-6xl md:text-8xl font-bold text-white mb-4">Discography</h1>
                <p className="text-gray-400 text-xl font-light max-w-2xl">Music & Video</p>
            </header>
            <CollageGrid projects={projects} />
        </main>
    );
}
