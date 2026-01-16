export interface Project {
    id: string;
    title: string;
    role: string;
    composer: string;
    year: string;
    image: string;
    images?: string[];
    link?: string;
    category?: string;
}
