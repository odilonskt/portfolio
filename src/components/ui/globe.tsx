"use client";

import createGlobe, { type COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const MOVEMENT_DAMPING = 1400;
const ROTATION_SPEED = 0.005;

/** Parte da configuração do cobe que não depende do tema (cores) nem do tamanho do canvas. */
const GLOBE_BASE_CONFIG: Pick<
  COBEOptions,
  "phi" | "theta" | "diffuse" | "mapSamples" | "mapBrightness" | "devicePixelRatio" | "markers"
> = {
  phi: 0,
  theta: 0.3,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  devicePixelRatio: 2,
  // Decorativo: polos de tecnologia pelo mundo (nenhum dado de visitante é usado aqui)
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
};

/**
 * Lê uma cor do tema (variável CSS, ex: "--brand") e converte pro formato [r,g,b] 0..1
 * que o cobe espera. Nunca usa valores fixos: lendo a variável computada, acompanha
 * claro/escuro (e qualquer ajuste futuro dos tokens) automaticamente.
 */
function resolveThemeColor(cssVar: string, fallback: [number, number, number]): [number, number, number] {
  if (typeof document === "undefined") return fallback;
  const probe = document.createElement("span");
  probe.style.color = `var(${cssVar})`;
  probe.style.position = "fixed";
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  document.body.appendChild(probe);
  const { color } = getComputedStyle(probe);
  document.body.removeChild(probe);

  const match = /rgba?\(([^)]+)\)/.exec(color);
  const [r, g, b] = match ? match[1].split(",").map((part) => Number.parseFloat(part)) : [];
  if (![r, g, b].every((value) => Number.isFinite(value))) return fallback;
  return [r! / 255, g! / 255, b! / 255];
}

function resolveGlobeColors(): Pick<COBEOptions, "baseColor" | "markerColor" | "glowColor"> {
  return {
    baseColor: resolveThemeColor("--muted", [1, 1, 1]),
    markerColor: resolveThemeColor("--brand", [1, 1, 1]),
    glowColor: resolveThemeColor("--background", [1, 1, 1]),
  };
}

export function Globe({
  className,
  /** Pausa a rotação automática (ex: controlada por um botão pausar/retomar externo). */
  paused = false,
}: {
  className?: string;
  paused?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const widthRef = useRef(0);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const animationRef = useRef<number>(0);
  const pausedRef = useRef(paused);
  // Movimento reduzido: nunca gira sozinho (WCAG 2.3.3 / prefers-reduced-motion)
  const reducedMotionRef = useRef(false);

  const { resolvedTheme } = useTheme();

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        widthRef.current = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = reducedMotionQuery.matches;
    const onReducedMotionChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
    };
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);

    const globe = createGlobe(canvasRef.current!, {
      ...GLOBE_BASE_CONFIG,
      ...resolveGlobeColors(),
      dark: resolvedTheme === "dark" ? 1 : 0,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
    });

    globeRef.current = globe;

    const render = () => {
      if (!pointerInteracting.current && !pausedRef.current && !reducedMotionRef.current) {
        phiRef.current += ROTATION_SPEED;
      }
      globe.update({
        phi: phiRef.current + rs.get(),
        width: widthRef.current * 2,
        height: widthRef.current * 2,
      });
      animationRef.current = window.requestAnimationFrame(render);
    };

    animationRef.current = window.requestAnimationFrame(render);

    setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
    }, 0);

    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
      globe.destroy();
      globeRef.current = null;
      window.removeEventListener("resize", onResize);
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
    };
    // Recria o globo quando o tema muda: cores e sombreamento do oceano (dark) vêm dos
    // tokens no momento da criação, então um novo tema precisa de uma nova instância.
  }, [rs, resolvedTheme]);

  return (
    // Puramente decorativo: nenhuma informação essencial depende dele
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 mx-auto aspect-square w-full max-w-150", className)}
    >
      <canvas
        className="size-full opacity-0 transition-opacity duration-500 contain-[layout_paint_size]"
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)}
      />
    </div>
  );
}
