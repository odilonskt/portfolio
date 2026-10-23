import { ViewTransition } from "react";

/**
 * Ao contrário do layout (que persiste), o template remonta a cada navegação entre
 * rotas — é o lugar certo para o crossfade de página. Nome próprio ("page-content",
 * nunca o implícito "root") para não colidir com a animação de troca de tema do
 * AnimatedThemeToggler, que já reserva `::view-transition-*(root)` em globals.css.
 * Âncoras (`/#secao`) não remontam o template: não há transição nessa navegação.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition name="page-content" default="auto">
      {children}
    </ViewTransition>
  );
}
