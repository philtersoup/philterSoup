"use client";

import { motion, useScroll, useTransform, useSpring, useVelocity, useAnimationFrame, useMotionValue } from "framer-motion";
import { useRef } from "react";

interface ParallaxTextProps {
    children: string;
    baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxTextProps) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    const x = useTransform(baseX, (v) => `${v}%`);

    const directionFactor = useRef<number>(1);
    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        // Apply scroll velocity effect
        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();

        baseX.set(baseX.get() + moveBy);
    });

    // Wrap logic: we render enough copies to cover the screen width + buffer
    // We need to reset baseX when it goes too far to create the loop
    useAnimationFrame(() => {
        if (baseX.get() <= -33.333) {
            baseX.set(0);
        } else if (baseX.get() >= 0) { // If going reverse
            baseX.set(-33.333);
        }
    });


    return (
        <div className="parallax-text overflow-hidden whitespace-nowrap flex flex-nowrap m-0 leading-[0.85]">
            <motion.div className="scroller flex whitespace-nowrap flex-nowrap" style={{ x }}>
                <span className="block mr-8">{children}</span>
                <span className="block mr-8">{children}</span>
                <span className="block mr-8">{children}</span>
                <span className="block mr-8">{children}</span>
                <span className="block mr-8">{children}</span>
                <span className="block mr-8">{children}</span>
            </motion.div>
        </div>
    );
}

export default function TiledKineticBackground() {
    const rows = Array.from({ length: 10 }); // Create enough rows to fill screen

    return (
        <div className="fixed inset-0 z-0 flex flex-col justify-center overflow-hidden pointer-events-none select-none bg-black">
            <div className="absolute inset-0 z-10 bg-linear-to-b from-black/80 via-transparent to-black/80 pointer-events-none" />
            <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[1px]" />

            <div className="flex flex-col gap-0 rotate-[-5deg] scale-110 origin-center">
                {rows.map((_, i) => (
                    <div key={i} className="font-blackout text-[15vh] leading-[0.85] text-transparent" style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.7)' }}>
                        <ParallaxText baseVelocity={i % 2 === 0 ? -2 : 2}>
                            PHILTERSOUP PHILTERSOUP PHILTERSOUP
                        </ParallaxText>
                    </div>
                ))}
            </div>
        </div>
    );
}
