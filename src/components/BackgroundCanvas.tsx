"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const GrainShader = {
    uniforms: {
        uTime: { value: 0 },
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform float uTime;
    varying vec2 vUv;
    
    float random(vec2 p) {
      return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    void main() {
      vec2 uv = vUv;
      float noise = random(uv + uTime);
      
      // Subtle colorful fog
      vec3 color = vec3(0.06, 0.06, 0.06); // Dark base
      float fog = sin(uv.x * 10.0 + uTime * 0.5) * sin(uv.y * 10.0 - uTime * 0.3);
      color += vec3(0.02, 0.02, 0.05) * fog;
      
      // Add grain
      color += (noise - 0.5) * 0.05;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

function GradientPlane() {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
        }),
        []
    );

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    return (
        <mesh>
            <planeGeometry args={[20, 10]} />
            <shaderMaterial
                ref={materialRef}
                uniforms={uniforms}
                vertexShader={GrainShader.vertexShader}
                fragmentShader={GrainShader.fragmentShader}
            />
        </mesh>
    );
}

export default function BackgroundCanvas() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
            <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]}>
                <GradientPlane />
            </Canvas>
        </div>
    );
}
