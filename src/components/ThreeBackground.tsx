"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// Configuration
const FONT_URL = "/assets/fonts/Blackout Midnight.ttf";
const ROWS = 20;
const ROW_HEIGHT = 0.8;
const FONT_SIZE = 0.9;
const MAX_OPACITY = 0.15; // Lowered opacity

// -------------------------------------------------------------
// CUSTOM SHADER MATERIAL
// -------------------------------------------------------------
const FillShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uTriggerTime: { value: 0 },
        uMode: { value: 0 },
        color: { value: new THREE.Color("#aaaaaa") }
    },
    vertexShader: `
      varying vec2 vGlobalPos;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vGlobalPos = worldPosition.xy;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uTriggerTime;
      uniform int uMode; 
      uniform vec3 color;
      varying vec2 vGlobalPos;

      void main() {
        float alpha = 0.0;
        
        if (uTriggerTime > 0.0) {
            float timeSince = uTime - uTriggerTime;
            float speedBase = 55.0; 
            
            if (uMode == 0) { // Radial Expand
                float waveHead = timeSince * speedBase;
                float waveWidth = 35.0;
                float dist = length(vGlobalPos);
                if (dist < waveHead && dist > (waveHead - waveWidth)) {
                   alpha = 1.0;
                   float tailPos = waveHead - waveWidth;
                   alpha *= smoothstep(tailPos, tailPos + 8.0, dist); 
                   alpha *= smoothstep(waveHead, waveHead - 1.0, dist);
                }
            }
            else if (uMode == 1) { // Radial Contract
                float maxDist = 55.0; 
                float waveHead = maxDist - (timeSince * speedBase);
                float waveWidth = 35.0;
                float dist = length(vGlobalPos);
                if (dist < (waveHead + waveWidth) && dist > waveHead) {
                    alpha = 1.0;
                    alpha *= smoothstep(waveHead, waveHead + 2.0, dist);
                    alpha *= smoothstep(waveHead + waveWidth, waveHead + waveWidth - 8.0, dist);
                }
            }
            else if (uMode == 2) { // Horizontal Slice
                float speed = speedBase * 1.2;
                float startX = -50.0;
                float waveHead = startX + (timeSince * speed);
                float waveWidth = 30.0;
                if (vGlobalPos.x < waveHead && vGlobalPos.x > (waveHead - waveWidth)) {
                    alpha = 1.0;
                    alpha *= smoothstep(waveHead - waveWidth, waveHead - waveWidth + 8.0, vGlobalPos.x);
                    alpha *= smoothstep(waveHead, waveHead - 1.0, vGlobalPos.x);
                }
            }
            else if (uMode == 3) { // Vertical Wipe (Top -> Bottom)
                float speed = speedBase * 0.8;
                float startY = 30.0;
                float waveHead = startY - (timeSince * speed);
                float waveWidth = 20.0;

                if (vGlobalPos.y > waveHead && vGlobalPos.y < (waveHead + waveWidth)) {
                    alpha = 1.0;
                    alpha *= smoothstep(waveHead, waveHead + 2.0, vGlobalPos.y); 
                    alpha *= smoothstep(waveHead + waveWidth, waveHead + waveWidth - 5.0, vGlobalPos.y);
                }
            }
        }
        
        gl_FragColor = vec4(color, alpha);
    }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide
});

function MovingRow({ text, y, velocity, scrollVelocityRef }: { text: string, y: number, velocity: number, scrollVelocityRef?: any }) {
    const repeatedText = `${text} ${text} ${text} ${text} ${text}`;

    return (
        <AnimatedGroup y={y} velocity={velocity} scrollVelocityRef={scrollVelocityRef}>
            <Text
                font={FONT_URL}
                fontSize={FONT_SIZE}
                letterSpacing={-0.02}
                lineHeight={1}
                color="white"
                fillOpacity={0}
                strokeWidth={0.02}
                strokeColor="white"
                strokeOpacity={MAX_OPACITY}
                anchorX="center"
                anchorY="middle"
                renderOrder={1}
            >
                {repeatedText}
            </Text>
            <Text
                font={FONT_URL}
                fontSize={FONT_SIZE}
                letterSpacing={-0.02}
                lineHeight={1}
                material={FillShaderMaterial}
                anchorX="center"
                anchorY="middle"
                position={[0, 0, 0.02]}
                renderOrder={2}
            >
                {repeatedText}
            </Text>
        </AnimatedGroup>
    );
}

function AnimatedGroup({ children, y, velocity, scrollVelocityRef }: any) {
    const ref = useMemo(() => new THREE.Group(), []);

    useEffect(() => {
        ref.position.y = y;
    }, [y, ref]);

    useFrame((state, delta) => {
        let currentVelocity = velocity;

        // Apply "warp" speed based on scroll velocity
        if (scrollVelocityRef && scrollVelocityRef.current !== 0) {
            // Add extra kick relative to scroll speed
            // Math.sign(velocity) ensures we speed up in the direction of travel
            // (Or we can make it chaotic by just adding raw scrollForce)
            // Let's make it so scrolling fast adds ENERGY to everything
            const boost = Math.abs(scrollVelocityRef.current) * 1.5 * Math.sign(velocity);
            currentVelocity += boost;
        }

        ref.position.x += currentVelocity * delta;

        const resetWidth = 50;
        if (ref.position.x < -resetWidth / 2) ref.position.x += resetWidth;
        if (ref.position.x > resetWidth / 2) ref.position.x -= resetWidth;
    });

    return <primitive object={ref}>{children}</primitive>;
}

const LERP_FACTOR = 0.1;

function Composition({ text }: { text: string }) {
    const { clock } = useThree();
    const groupRef = useRef<THREE.Group>(null);

    // Scroll tracking
    const lastScrollY = useRef(0);
    const scrollVelocity = useRef(0);

    const [displayedText, setDisplayedText] = useState(text);

    useEffect(() => {
        if (text !== displayedText) {
            setDisplayedText(text);
            const nextMode = Math.floor(Math.random() * 4);
            FillShaderMaterial.uniforms.uMode.value = nextMode;
            FillShaderMaterial.uniforms.uTriggerTime.value = clock.getElapsedTime();
        }
    }, [text, displayedText, clock]);

    useFrame((state) => {
        FillShaderMaterial.uniforms.uTime.value = clock.getElapsedTime();

        // Calculate Scroll Velocity
        if (typeof window !== 'undefined') {
            const currentY = window.scrollY;
            const deltaY = currentY - lastScrollY.current;
            const velocity = deltaY * 0.1; // Scale down

            // Smooth interpolation
            scrollVelocity.current = THREE.MathUtils.lerp(scrollVelocity.current, velocity, 0.1);
            lastScrollY.current = currentY;
        }

        const vel = scrollVelocity.current;

        // Apply Banking / Tilt effects
        if (groupRef.current) {
            // Tilt based on velocity
            const targetRotX = THREE.MathUtils.degToRad(vel * 2.5);
            // Banking based on velocity
            const targetRotZ = THREE.MathUtils.degToRad(vel * -1.5) - (5 * (Math.PI / 180));

            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, LERP_FACTOR);
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, LERP_FACTOR);
        }
    });

    const rows = useMemo(() => {
        return Array.from({ length: ROWS }).map((_, i) => {
            const dir = i % 2 === 0 ? -1 : 1;
            const speed = 2.5;
            const y = (i - ROWS / 2) * ROW_HEIGHT + 0.6;
            return { id: i, y, velocity: dir * speed };
        });
    }, []);

    return (
        <group ref={groupRef} scale={[1.1, 1.1, 1.1]}>
            {rows.map((r) => (
                <MovingRow
                    key={r.id}
                    text={displayedText}
                    y={r.y}
                    velocity={r.velocity}
                    scrollVelocityRef={scrollVelocity}
                />
            ))}
        </group>
    );
}

export default function ThreeBackground({ text = "PHILTERSOUP" }: { text?: string }) {
    return (
        <div className="fixed inset-0 z-0 bg-black pointer-events-none select-none">
            <div className="absolute inset-0 z-10 bg-linear-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />

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
