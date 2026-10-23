"use client";

import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMessages } from "@/lib/i18n/client";
import { easterEgg } from "@/lib/i18n/messages/easter-egg";

// Sequência clássica: Cima Cima Baixo Baixo Esquerda Direita Esquerda Direita B A
const KONAMI_SEQUENCE = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return target.isContentEditable;
}

function subscribeToReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

/** Easter egg sem propósito funcional: digite o código Konami em qualquer página do site. */
export default function EasterEgg() {
  const t = useMessages(easterEgg);
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const stepRef = useRef(0);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) return;

      const key = event.key.toLowerCase();
      const expected = KONAMI_SEQUENCE[stepRef.current];

      if (key === expected) {
        stepRef.current += 1;
        if (stepRef.current === KONAMI_SEQUENCE.length) {
          stepRef.current = 0;
          setOpen(true);
        }
      } else {
        // Reinicia, mas já conta a tecla atual caso ela seja o primeiro passo da sequência.
        stepRef.current = key === KONAMI_SEQUENCE[0] ? 1 : 0;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm text-center">
        <div className="flex flex-col items-center gap-3">
          {prefersReducedMotion ? (
            <Sparkles className="size-10 text-brand" aria-hidden="true" />
          ) : (
            <motion.div
              className="relative"
              initial={{ scale: 0, rotate: -30, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
            >
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-full bg-brand/30 blur-md"
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.15, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
              />
              <motion.div
                animate={{ rotate: [0, -8, 8, 0] }}
                transition={{ delay: 0.3, duration: 0.6, ease: "easeInOut" }}
              >
                <Sparkles className="size-10 text-brand" aria-hidden="true" />
              </motion.div>
            </motion.div>
          )}
          <DialogHeader className="items-center sm:text-center">
            <DialogTitle>{t.title}</DialogTitle>
            <DialogDescription>{t.description}</DialogDescription>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
}
