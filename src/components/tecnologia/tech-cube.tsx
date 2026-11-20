"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

import { TECH_ICONS } from "@/components/tecnologia/icons";
import { TECHNOLOGIES } from "@/lib/content/profile";
import { useMessages } from "@/lib/i18n/client";
import { home } from "@/lib/i18n/messages/home";

const FACES = TECHNOLOGIES.slice(0, 6);
// Uma rotação por face do cubo: topo/baixo e quatro laterais
const FACE_TRANSFORMS = [
  "rotateY(0deg)",
  "rotateY(90deg)",
  "rotateY(180deg)",
  "rotateY(-90deg)",
  "rotateX(90deg)",
  "rotateX(-90deg)",
];
const SIZE_REM = 9;
const KEY_STEP = 20;
const DEG_PER_PX = 0.6;

/**
 * Cubo 3D das tecnologias, em CSS puro (sem dependência): gira ao arrastar
 * (mouse/toque) ou com as setas do teclado. Não tem movimento automático,
 * então não precisa de pausa; o giro é sempre ação do visitante.
 */
export function TechCube() {
  const t = useMessages(home).technologies;
  const [rotation, setRotation] = useState({ x: -20, y: 30 });
  const drag = useRef<{ x: number; y: number } | null>(null);

  function rotate(dx: number, dy: number) {
    setRotation((r) => ({ x: Math.max(-80, Math.min(80, r.x - dy)), y: r.y + dx }));
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    drag.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    rotate((event.clientX - drag.current.x) * DEG_PER_PX, (event.clientY - drag.current.y) * DEG_PER_PX);
    drag.current = { x: event.clientX, y: event.clientY };
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-KEY_STEP, 0],
      ArrowRight: [KEY_STEP, 0],
      ArrowUp: [0, -KEY_STEP],
      ArrowDown: [0, KEY_STEP],
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    rotate(...move);
  }

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div
        role="group"
        aria-label={t.cubeLabel}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onKeyDown={onKeyDown}
        // pan-y: no toque, arrastar na vertical continua rolando a página
        className="cursor-grab touch-pan-y rounded-2xl p-10 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
        style={{ perspective: "900px" }}
      >
        <div
          className="relative transition-transform duration-150 ease-out motion-reduce:transition-none"
          style={{
            width: `${SIZE_REM}rem`,
            height: `${SIZE_REM}rem`,
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {FACES.map((name, index) => {
            const Icon = TECH_ICONS[name];
            return (
              <div
                key={name}
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card text-foreground [backface-visibility:hidden]"
                style={{ transform: `${FACE_TRANSFORMS[index]} translateZ(${SIZE_REM / 2}rem)` }}
              >
                <Icon className="size-12" aria-hidden="true" />
                <span className="text-sm font-medium">{name}</span>
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{t.cubeHint}</p>
    </div>
  );
}
