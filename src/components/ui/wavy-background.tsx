"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface WavyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
}

export function WavyBackground({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
}: WavyBackgroundProps) {
  const noise = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const wRef = useRef(0);
  const hRef = useRef(0);
  const ntRef = useRef(0);
  const rafRef = useRef<number>(0);

  const waveColors = colors ?? [
    "#2d8a7e",
    "#cc7e3a",
    "#4d7a4e",
    "#b87272",
    "#876f4c",
  ];

  const getSpeed = useCallback(() => {
    return speed === "fast" ? 0.002 : 0.001;
  }, [speed]);

  const drawWave = useCallback(
    (n: number) => {
      const ctx = ctxRef.current;
      if (!ctx) return;

      ntRef.current += getSpeed();

      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth || 50;
        ctx.strokeStyle = waveColors[i % waveColors.length];
        for (let x = 0; x < wRef.current; x += 5) {
          const y = noise3D(x / 800, 0.3 * i, ntRef.current) * 100;
          ctx.lineTo(x, y + hRef.current * 0.5);
        }
        ctx.stroke();
        ctx.closePath();
      }
    },
    [getSpeed, waveColors, waveWidth]
  );

  const render = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.fillStyle = backgroundFill || "var(--rebirth-warm-black)";
    ctx.globalAlpha = waveOpacity;
    ctx.fillRect(0, 0, wRef.current, hRef.current);
    drawWave(5);
    rafRef.current = requestAnimationFrame(render);
  }, [backgroundFill, drawWave, waveOpacity]);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctxRef.current = ctx;
    wRef.current = ctx.canvas.width = window.innerWidth;
    hRef.current = ctx.canvas.height = window.innerHeight;
    ctx.filter = `blur(${blur}px)`;
    ntRef.current = 0;

    window.onresize = () => {
      wRef.current = ctx.canvas.width = window.innerWidth;
      hRef.current = ctx.canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };

    render();
  }, [blur, render]);

  useEffect(() => {
    init();
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [init]);

  return (
    <div
      className={cn(
        "relative flex h-screen flex-col items-center justify-center",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
}

// Simple noise function for wave generation
function noise3D(x: number, y: number, z: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;

  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const zf = z - Math.floor(z);

  const u = fade(xf);
  const v = fade(yf);
  const w = fade(zf);

  const a = (hash(X) + Y) & 255;
  const b = (hash(X + 1) + Y) & 255;

  return lerp(
    w,
    lerp(
      v,
      lerp(u, grad(hash(a + Z), xf, yf, zf), grad(hash(b + Z), xf - 1, yf, zf)),
      lerp(u, grad(hash(a + 1 + Z), xf, yf - 1, zf), grad(hash(b + 1 + Z), xf - 1, yf - 1, zf))
    ),
    lerp(
      v,
      lerp(u, grad(hash(a + Z + 1), xf, yf, zf - 1), grad(hash(b + Z + 1), xf - 1, yf, zf - 1)),
      lerp(u, grad(hash(a + 1 + Z + 1), xf, yf - 1, zf - 1), grad(hash(b + 1 + Z + 1), xf - 1, yf - 1, zf - 1))
    )
  );
}

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(t: number, a: number, b: number) {
  return a + t * (b - a);
}

function grad(h: number, x: number, y: number, z: number) {
  const hh = h & 15;
  const u = hh < 8 ? x : y;
  const v = hh < 4 ? y : hh === 12 || hh === 14 ? x : z;
  return ((hh & 1) === 0 ? u : -u) + ((hh & 2) === 0 ? v : -v);
}

function hash(i: number) {
  return perm[i & 255];
}

// Permutation table
const perm = Array.from({ length: 512 }, (_, i) => {
  const p = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
    140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247,
    120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177,
    33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165,
    71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211,
    133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25,
    63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
    135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217,
    226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206,
    59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248,
    152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22,
    39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218,
    246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
    81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
    184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93,
    222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
  ];
  return p[i % 256];
});
