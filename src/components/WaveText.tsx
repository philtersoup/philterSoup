"use client";

import { useEffect, useState } from "react";

interface WaveTextProps {
    text: string;
    rowIndex?: number;
}

export default function WaveText({
    text,
    rowIndex = 0,
}: WaveTextProps) {
    const letters = Array.from(text);
    const [triggered, setTriggered] = useState(false);

    // Calculate center of the string for the math-based radial delay
    // Text length / 2 is the horizontal center index.
    // There are 10 rows, so 4.5 is the vertical center index.
    const centerCharIndex = letters.length / 2;
    const centerRowIndex = 4.5;

    useEffect(() => {
        // Reset and trigger animation whenever text changes
        setTriggered(true);

        // Cleanup if needed? No, purely CSS.
    }, [text]);

    return (
        <div className="relative inline-block">
            {letters.map((char, i) => {
                // Pure math based delay.
                // Horizontal distance from center
                const dx = Math.abs(i - centerCharIndex);
                // Vertical distance from center (scaled to match roughly the aspect of text)
                // Letters are taller than they are wide, or vice versa? 
                // Let's assume a factor. 
                // 1 row difference is roughly equivalent to maybe 5-6 characters in width? 
                const dy = Math.abs(rowIndex - centerRowIndex) * 8;

                // Simple Euclidean-ish distance approximation
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Delay factor
                const delay = distance * 0.04;

                return (
                    <span
                        key={i}
                        className={`inline-block ${triggered ? 'animate-wave-flash' : ''}`}
                        style={{
                            WebkitTextStroke: "1px rgba(255,255,255,0.5)",
                            whiteSpace: "pre-wrap",
                            color: "rgba(255,255,255,0)",
                            animationDelay: `${delay}s`
                        }}
                    >
                        {char}
                    </span>
                );
            })}
        </div>
    );
}
