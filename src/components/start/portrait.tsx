"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { PROFILE } from "@/lib/content/profile";

const ROTATE_INTERVAL_MS = 4500;

/** Retrato do hero: troca de foto sozinho a cada alguns segundos (crossfade). */
export function Portrait({ alt }: { alt: string }) {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const photos = PROFILE.photos;

  useEffect(() => {
    if (prefersReducedMotion || photos.length < 2) return;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % photos.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [prefersReducedMotion, photos.length]);

  return (
    <figure className="relative size-44 shrink-0 overflow-hidden rounded-3xl border border-border sm:size-56 md:size-64">
      <AnimatePresence>
        <motion.div
          key={photos[index]}
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={photos[index]}
            alt={alt}
            width={512}
            height={512}
            priority={index === 0}
            sizes="(min-width: 768px) 256px, 224px"
            className="size-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
    </figure>
  );
}
