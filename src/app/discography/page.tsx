import { promises as fs } from 'fs';
import path from 'path';
import MixedGrid from "@/components/MixedGrid";
import { Project, PressItem, GridItem } from "@/lib/types";

function parseDate(dateStr: string): number {
    // Handle "August 2025" or similar
    if (dateStr.includes(' ')) {
        return new Date(dateStr).getTime();
    }
    // Handle "2025"
    if (/^\d{4}$/.test(dateStr)) {
        // Assume start of year for sorting, so items with specific dates in that year usually come after/before depending on logic?
        // Actually, if we want specific dates to float to top of that year, we might need care.
        // But for "Discography" items, we only have year.
        // Let's assume January 1st.
        return new Date(`${dateStr}-01-01`).getTime();
    }
    return 0;
}

async function getMixedContent() {
    const projectsPath = path.join(process.cwd(), 'src/data/projects.json');
    const pressPath = path.join(process.cwd(), 'src/data/press.json');

    const [projectsData, pressData] = await Promise.all([
        fs.readFile(projectsPath, 'utf-8'),
        fs.readFile(pressPath, 'utf-8')
    ]);

    const projects: Project[] = JSON.parse(projectsData);
    const press: PressItem[] = JSON.parse(pressData);

    const discographyProjects = projects
        .filter(p => p.category === 'Discography')
        .map(p => ({ ...p, type: 'project' } as GridItem));

    const pressItems = press
        .map(p => ({ ...p, type: 'press' } as GridItem));

    const allItems = [...discographyProjects, ...pressItems].sort((a, b) => {
        const dateA = a.type === 'project' ? parseDate(a.year) : parseDate(a.date);
        const dateB = b.type === 'project' ? parseDate(b.year) : parseDate(b.date);
        return dateB - dateA;
    });

    return allItems;
}

export default async function DiscographyPage() {
    const items = await getMixedContent();

    return (
        <main className="min-h-screen bg-black text-white">
            <header className="pt-24 pb-4 px-4 md:px-12">
                <h1 className="font-syne text-6xl md:text-8xl font-bold text-white mb-4">Discography</h1>
                <p className="text-gray-400 text-xl font-light max-w-2xl">Releases & Reviews</p>
            </header>

            <MixedGrid items={items} />
        </main>
    );
}
