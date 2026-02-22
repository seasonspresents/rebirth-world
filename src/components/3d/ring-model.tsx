"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

/** Color layers representing the 7-ply skateboard maple */
const WOOD_LAYERS = [
  "#c4a067", // natural maple
  "#2d8a7e", // teal dye
  "#7a3f13", // dark wood
  "#cc7e3a", // amber gold
  "#c4a067", // natural maple
  "#1c1917", // charcoal grip
  "#d0a36a", // light maple
];

interface RingModelProps {
  /** Preset wood color layers (default: skateboard maple) */
  layers?: string[];
  /** Outer radius of ring (default: 1) */
  radius?: number;
  /** Thickness of ring tube (default: 0.2) */
  tube?: number;
  /** Auto-rotate speed (default: 0.3) */
  rotateSpeed?: number;
  /** Engraving text to display on inner surface */
  engravingText?: string;
  /** Whether the ring is interactive (orbit controls handle rotation) */
  autoRotate?: boolean;
}

/**
 * Procedural 3D ring with layered skateboard wood stripes.
 * Creates a torus geometry with custom shader material
 * that renders 7 colored bands to simulate recycled maple layers.
 */
export function RingModel({
  layers = WOOD_LAYERS,
  radius = 1,
  tube = 0.22,
  rotateSpeed = 0.3,
  engravingText,
  autoRotate = true,
}: RingModelProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Custom shader for wood layers
  const material = useMemo(() => {
    const layerColors = layers.map((hex) => new THREE.Color(hex));

    return new THREE.ShaderMaterial({
      uniforms: {
        uLayers: {
          value: layerColors,
        },
        uLayerCount: { value: layerColors.length },
        uGrain: { value: 0.04 },
      },
      vertexShader: /* glsl */ `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        void main() {
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uLayers[7];
        uniform int uLayerCount;
        uniform float uGrain;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;

        // Simple hash for grain noise
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        void main() {
          // Map UV y-coordinate to layer bands
          float t = vUv.y * float(uLayerCount);
          int idx = int(floor(t));
          float frac = fract(t);

          // Clamp index
          int i0 = min(idx, uLayerCount - 1);
          int i1 = min(idx + 1, uLayerCount - 1);

          // Smooth blend between layers
          float blend = smoothstep(0.4, 0.6, frac);
          vec3 color = mix(uLayers[i0], uLayers[i1], blend);

          // Add subtle wood grain noise
          float grain = hash(vUv * 200.0) * uGrain;
          color += grain - uGrain * 0.5;

          // Basic lighting
          vec3 lightDir = normalize(vec3(1.0, 1.0, 2.0));
          float diff = max(dot(vNormal, lightDir), 0.0) * 0.6 + 0.4;

          // Specular highlight for glossy CA finish
          vec3 viewDir = normalize(cameraPosition - vPosition);
          vec3 halfDir = normalize(lightDir + viewDir);
          float spec = pow(max(dot(vNormal, halfDir), 0.0), 64.0) * 0.4;

          gl_FragColor = vec4(color * diff + vec3(spec), 1.0);
        }
      `,
    });
  }, [layers]);

  useFrame((_, delta) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += delta * rotateSpeed;
    }
  });

  // Position engraving text along the inner surface of the ring
  const engravingGroup = useMemo(() => {
    if (!engravingText) return null;
    // Inner radius is the torus radius minus tube radius
    const innerR = radius - tube + 0.01;
    return { innerR };
  }, [engravingText, radius, tube]);

  return (
    <mesh ref={meshRef} material={material} rotation={[Math.PI / 6, 0, 0]}>
      <torusGeometry args={[radius, tube, 64, 128]} />
      {engravingText && engravingGroup && (
        <group>
          {/* Engraving text rendered along the inner band */}
          <Text
            fontSize={tube * 0.5}
            color="#897b6b"
            anchorX="center"
            anchorY="middle"
            position={[0, 0, -engravingGroup.innerR]}
            rotation={[0, Math.PI, 0]}
            maxWidth={radius * 2}
            font="/fonts/ClashDisplay-Medium.woff2"
          >
            {engravingText}
          </Text>
        </group>
      )}
    </mesh>
  );
}

export { WOOD_LAYERS };
