"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Ao contrário do layout (que persiste), o template remonta a cada navegação entre
 * rotas — só um fade de entrada na página nova (sem exit da antiga: tentar animar os
 * dois lados exigiria manter a página antiga montada durante a troca de rota, o que
 * complica a suspensão/streaming do App Router). CSS puro (Framer Motion), sem a
 * View Transition API nativa do navegador: ela rejeita a transição quando a aba está
 * oculta durante a navegação, o que o React expunha como erro "recuperável" no dev.
 * Âncoras (`/#secao`) não remontam o template: não há fade nessa navegação.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
