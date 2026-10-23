"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Estrutura padrão das seções da home: mesma largura, ritmo vertical e cabeçalho.
 * A <section> é rotulada pelo próprio título (aria-labelledby) para leitores de tela.
 */

interface SectionHeaderProps {
  id: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ id, title, description, className }: SectionHeaderProps) {
  return (
    <header className={cn("mb-10 flex flex-col gap-3 sm:mb-12", className)}>
      <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && <p className="max-w-prose text-base text-muted-foreground sm:text-lg">{description}</p>}
    </header>
  );
}

interface SectionProps {
  /** Âncora usada no menu (ex.: "Projeto" → /#Projeto) */
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  /** Largura do conteúdo; o padrão acompanha o restante da home */
  width?: "default" | "narrow";
}

export function Section({ id, title, description, children, className, width = "default" }: SectionProps) {
  const headingId = `${id}-titulo`;
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      aria-labelledby={headingId}
      className={cn("scroll-mt-24 py-20 sm:py-24", className)}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className={cn("mx-auto w-full px-4 sm:px-6", width === "narrow" ? "max-w-3xl" : "max-w-5xl")}>
        <SectionHeader id={headingId} title={title} description={description} />
        {children}
      </div>
    </motion.section>
  );
}
