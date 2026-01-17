"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// Configuration
const FONT_URL = "/assets/fonts/Blackout Midnight.ttf";
const ROWS = 10;
const ROW_HEIGHT = 1.3;
const MAX_OPACITY = 0.4; // Significantly brighter default state

// -------------------------------------------------------------
// CUSTOM SHADER MATERIAL
// Supports multiple wipe modes driven by 'uMode'
// -------------------------------------------------------------
const FillShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uTriggerTime: { value: 0 },
        uMode: { value: 0 }, // 0: Radial Out, 1: Radial In, 2: Horizontal Wipe
        color: { value: new THREE.Color("white") }
    },
    vertexShader: `
      varying vec2 vGlobalPos;
      void main() {
        // Calculate global position for screen-space effects
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vGlobalPos = worldPosition.xy;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uTriggerTime;
      uniform int uMode; // Randomly selected mode
      uniform vec3 color;
      varying vec2 vGlobalPos;

      void main() {
        float alpha = 0.0;
        
        if (uTriggerTime > 0.0) {
            float timeSince = uTime - uTriggerTime;
            
            // --- MODE 0: RADIAL EXPAND (Center -> Out) ---
            if (uMode == 0) {
                float speed = 35.0;
                float waveHead = timeSince * speed;
                float waveWidth = 30.0;
                float dist = length(vGlobalPos);
                
                // Solid band
                if (dist < waveHead && dist > (waveHead - waveWidth)) {
                   alpha = 1.0;
                   // Fade out tail
                   float tailPos = waveHead - waveWidth;
                   alpha *= smoothstep(tailPos, tailPos + 5.0, dist); 
                   // Fade out head
                   alpha *= smoothstep(waveHead, waveHead - 2.0, dist);
                }
            }
            
            // --- MODE 1: RADIAL CONTRACT (Out -> Center) ---
            else if (uMode == 1) {
                float speed = 35.0;
                float maxDist = 50.0; // Start far out
                float waveHead = maxDist - (timeSince * speed);
                float waveWidth = 30.0;
                float dist = length(vGlobalPos);
                
                if (dist < (waveHead + waveWidth) && dist > waveHead) {
                    alpha = 1.0;
                    alpha *= smoothstep(waveHead, waveHead + 2.0, dist);
                    alpha *= smoothstep(waveHead + waveWidth, waveHead + waveWidth - 5.0, dist);
                }
            }
            
            // --- MODE 2: HORIZONTAL SLICE (Left -> Right) ---
            else if (uMode == 2) {
                float speed = 40.0;
                float startX = -40.0;
                float waveHead = startX + (timeSince * speed * 1.5);
                float waveWidth = 25.0;
                
                if (vGlobalPos.x < waveHead && vGlobalPos.x > (waveHead - waveWidth)) {
                    alpha = 1.0;
                    alpha *= smoothstep(waveHead - waveWidth, waveHead - waveWidth + 5.0, vGlobalPos.x);
                    alpha *= smoothstep(waveHead, waveHead - 2.0, vGlobalPos.x);
                }
            }
        }
        
        // Final Output
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide
});


function MovingRow({ text, y, velocity }: { text: string, y: number, velocity: number }) {
    return (
        <AnimatedGroup y={y} velocity={velocity}>
            {/* Layer 1: Outline (Always visible) */}
            <Text
                font={FONT_URL}
                fontSize={1.5}
                letterSpacing={-0.02}
                lineHeight={0.85}
                color="white"
                fillOpacity={0}
                strokeWidth={0.02}
                strokeColor="white"
                strokeOpacity={MAX_OPACITY}
                anchorX="center"
                anchorY="middle"
                renderOrder={1}
            >
                {`${text} ${text} ${text}`}
            </Text>

            {/* Layer 2: Dynamic Fill (Shader) */}
            <Text
                font={FONT_URL}
                fontSize={1.5}
                letterSpacing={-0.02}
                lineHeight={0.85}
                material={FillShaderMaterial}
                anchorX="center"
                anchorY="middle"
                position={[0, 0, 0.02]}
                renderOrder={2}
            >
                {`${text} ${text} ${text}`}
            </Text>
        </AnimatedGroup>
    );
}

function AnimatedGroup({ children, y, velocity }: any) {
    const ref = useMemo(() => new THREE.Group(), []);

    useEffect(() => {
        ref.position.y = y;
    }, [y, ref]);

    useFrame((state, delta) => {
        ref.position.x += velocity * delta;
        const resetWidth = 50;
        if (ref.position.x < -resetWidth / 2) ref.position.x += resetWidth;
        if (ref.position.x > resetWidth / 2) ref.position.x -= resetWidth;
    });

    return <primitive object={ref}>{children}</primitive>;
}

function Composition({ text }: { text: string }) {
    const { clock } = useThree();

    // Internal state
    const [displayedText, setDisplayedText] = useState(text);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Trigger Transition
    useEffect(() => {
        if (text !== displayedText) {
            setIsTransitioning(true);
            setDisplayedText(text);

            // Randomize the effect mode (0, 1, or 2)
            const nextMode = Math.floor(Math.random() * 3);
            FillShaderMaterial.uniforms.uMode.value = nextMode;

            // Reset Trigger Time to NOW
            FillShaderMaterial.uniforms.uTriggerTime.value = clock.getElapsedTime();
        }
    }, [text, displayedText, clock]);

    useFrame(() => {
        FillShaderMaterial.uniforms.uTime.value = clock.getElapsedTime();
    });

    const rows = useMemo(() => {
        return Array.from({ length: ROWS }).map((_, i) => {
            const dir = i % 2 === 0 ? -1 : 1;
            const speed = 2.0;
            const y = (i - ROWS / 2) * ROW_HEIGHT + 0.6;
            return { id: i, y, velocity: dir * speed };
        });
    }, []);

    return (
        <group rotation={[0, 0, -5 * (Math.PI / 180)]} scale={[1.1, 1.1, 1.1]}>
            {rows.map((r) => (
                <MovingRow
                    key={r.id}
                    text={displayedText}
                    y={r.y}
                    velocity={r.velocity}
                />
            ))}
        </group>
    );
}

export default function ThreeBackground({ text = "PHILTERSOUP" }: { text?: string }) {
    return (
        <div className="fixed inset-0 z-0 bg-black pointer-events-none select-none">
            <div className="absolute inset-0 z-10 bg-linear-to-b from-black/80 via-transparent to-black/80 pointer-events-none" />

            <Canvas
                camera={{ position: [0, 0, 10], fov: 45 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: false }}
                onCreated={({ gl }) => {
                    gl.setClearColor('#000000');
                }}
            >
                <Composition text={text} />
            </Canvas>
        </div>
    );
}
