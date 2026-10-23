"use client";

import { motion } from "motion/react";
import { useState, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { Globe } from "@/components/ui/globe";
import { useMessages } from "@/lib/i18n/client";
import { githubGlobe } from "@/lib/i18n/messages/github-globe";
import { cn } from "@/lib/utils";

/** Assina mudanças de "prefers-reduced-motion" (useSyncExternalStore, sem setState em effect). */
function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Globo 3D decorativo atrás do retrato, no hero. Some sozinho com "movimento
 * reduzido" (nada para pausar); fora disso, mostra um botão pausar/retomar
 * real e com foco, como a faixa de Tecnologias.
 */
export function GithubGlobe({ className }: { className?: string }) {
  const [paused, setPaused] = useState(false);
  // Falso no servidor/primeira pintura; sincroniza com a preferência real assim que monta no cliente.
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const t = useMessages(githubGlobe);

  return (
    <>
      <motion.div
        initial={reducedMotion ? undefined : { opacity: 0, scale: 0.92 }}
        animate={reducedMotion ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "pointer-events-none absolute -inset-10 -z-10 blur-[0.5px] [mask-image:radial-gradient(circle,black_40%,transparent_75%)] sm:-inset-12 md:-inset-16",
          className,
        )}
      >
        <div className="opacity-20 dark:opacity-25">
          <Globe paused={paused || reducedMotion} />
        </div>
      </motion.div>

      {!reducedMotion && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
          aria-label={paused ? t.resume : t.pause}
          title={paused ? t.resume : t.pause}
          className="absolute -right-2 -bottom-2 z-10 size-7 text-muted-foreground"
        >
          <span aria-hidden="true" className="text-base leading-none">
            {paused ? "▶️" : "⏸️"}
          </span>
        </Button>
      )}
    </>
  );
}
