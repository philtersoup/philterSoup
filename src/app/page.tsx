
import Link from "next/link";
import Image from "next/image";
import BackgroundCanvas from "@/components/BackgroundCanvas";

export default function Home() {
  const sections = [
    { title: "Media Composition", href: "/media-composition", desc: "Music Production & Composition" },
    { title: "Creative Technologist", href: "/creative-technologist", desc: "Computational Art & Design" },
    { title: "Audio Engineering", href: "/audio-engineering", desc: "Recording & Mixing" },
    { title: "Discography", href: "/discography", desc: "Music & Video" },
  ];

  return (
    <main className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
      <BackgroundCanvas />

      <div className="z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <Image
            src="/assets/images/philterSoup_splash.gif"
            alt="philterSoup Splash"
            width={300}
            height={300}
            className="mx-auto rounded-full mix-blend-screen"
            unoptimized
          />
        </div>
        <h1 className="font-syne text-5xl md:text-8xl font-bold mb-8 leading-tight animate-fade-in-up delay-100">
          Hi, I&apos;m <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-600">philterSoup</span>
        </h1>
        <p className="text-xl md:text-3xl text-gray-300 font-light mb-16 animate-fade-in-up delay-100">
          I work with sound, visuals and form.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mx-auto animate-fade-in-up delay-200">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group block p-8 border border-white/10 bg-black/50 backdrop-blur-sm hover:bg-white/5 transition-all duration-500 hover:scale-105 hover:border-white/30 rounded-lg text-left"
            >
              <h2 className="text-2xl font-bold font-syne mb-2 group-hover:text-pink-400 transition-colors">{section.title}</h2>
              <p className="text-sm text-gray-400 font-mono tracking-wide">{section.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
