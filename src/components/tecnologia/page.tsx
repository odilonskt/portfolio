"use client";

import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { TECH_ICONS } from "@/components/tecnologia/icons";
import { TechCube } from "@/components/tecnologia/tech-cube";
import { Button } from "@/components/ui/button";
import { TECHNOLOGIES } from "@/lib/content/profile";
import { useMessages } from "@/lib/i18n/client";
import { home } from "@/lib/i18n/messages/home";
import { cn } from "@/lib/utils";

import styles from "./InfinityScroll.module.css";

function TechList({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      className={cn(styles.track, hidden && styles.duplicate)}
      // A cópia existe só para o loop contínuo: fica fora da árvore de acessibilidade
      aria-hidden={hidden || undefined}
      aria-label={hidden ? undefined : "Tecnologias"}
    >
      {TECHNOLOGIES.map((name) => {
        const Icon = TECH_ICONS[name];
        return (
          <li key={name} className={styles.item}>
            <Icon className="size-8 sm:size-10" aria-hidden="true" />
            <span className="text-sm">{name}</span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Faixa de tecnologias em rolagem contínua.
 * Acessibilidade (WCAG 2.2.2): pode ser pausada por botão, pausa com mouse/foco e
 * vira uma grade estática com "movimento reduzido".
 */
export default function TechMarquee() {
  const [paused, setPaused] = useState(false);
  const t = useMessages(home).technologies;

  return (
    <div className="flex flex-col gap-4">
      <div className={styles.viewport} data-paused={paused || undefined}>
        <TechList />
        <TechList hidden />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setPaused((value) => !value)}
        aria-pressed={paused}
        className={cn("self-end", styles.toggle)}
      >
        {paused ? <Play data-icon="inline-start" aria-hidden="true" /> : <Pause data-icon="inline-start" aria-hidden="true" />}
        {paused ? t.resume : t.pause}
      </Button>

      <TechCube />
    </div>
  );
}
