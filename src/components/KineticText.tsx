"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue, useVelocity, useAnimationFrame } from "framer-motion";
import { useRef, useEffect } from "react";

interface KineticTextProps {
    text: string;
    className?: string;
}

export default function KineticText({ text, className = "" }: KineticTextProps) {
    // Scroll based skew
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
    const skewX = useTransform(smoothVelocity, [-1000, 1000], [-30, 30]);

    // Mouse interactive distortion
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const x = useSpring(mouseX, { damping: 30, stiffness: 200 });
    const y = useSpring(mouseY, { damping: 30, stiffness: 200 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Calculate normalized mouse position (-1 to 1) relative to center
            const { innerWidth, innerHeight } = window;
            const xPos = (e.clientX / innerWidth - 0.5) * 50; // Move up to 50px
            const yPos = (e.clientY / innerHeight - 0.5) * 50;

            mouseX.set(xPos);
            mouseY.set(yPos);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className={`perspective-1000 ${className}`}>
            <motion.h1
                className="font-blackout text-transparent text-stroke-white text-[12vw] leading-[0.8] tracking-tighter uppercase whitespace-pre-wrap text-center cursor-default select-none mix-blend-difference"
                style={{
                    skewX,
                    x,
                    y,
                    transformStyle: "preserve-3d"
                }}
                whileHover={{
                    scale: 1.05,
                    textShadow: "0px 0px 20px rgba(255,255,255,0.8)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
                {text}
            </motion.h1>
        </div>
    );
}
