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

export interface PressItem {
    id: string;
    title: string;
    publication: string;
    date: string;
    excerpt: string;
    link: string;
}

export type GridItem =
    | ({ type: 'project' } & Project)
    | ({ type: 'press' } & PressItem);
