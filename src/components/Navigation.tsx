
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
    const pathname = usePathname();

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Media Composition", path: "/media-composition" },
        { name: "Creative Technologist", path: "/creative-technologist" },
        { name: "Audio Engineering", path: "/audio-engineering" },
        { name: "Discography", path: "/discography" },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center mix-blend-difference text-white">
            <Link href="/" className="text-2xl font-bold font-syne tracking-tighter hover:scale-105 transition-transform">
                philterSoup
            </Link>

            <div className="hidden md:flex gap-8">
                {navItems.map((item) => {
                    if (item.path === '/') return null; // Don't show Home in list if logo is home
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`uppercase text-xs tracking-widest hover:underline decoration-wavy underline-offset-4 transition-all ${pathname === item.path ? "underline" : ""
                                }`}
                        >
                            {item.name}
                        </Link>
                    )
                })}
            </div>
            {/* Mobile menu trigger could go here */}
        </nav>
    );
}
