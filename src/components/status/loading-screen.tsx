import { common } from "@/lib/i18n/messages/common";
import { getLocale } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

/**
 * Indicador de carregamento: anel cujo arco cresce e encolhe enquanto gira (ou,
 * passando `children`, um skeleton que imita o layout real da página).
 * - Surge com fade após 200ms (navegações rápidas não piscam)
 * - Anunciado por leitores de tela (role="status")
 * - Com "movimento reduzido" fica estático (regra global em globals.css)
 *
 * Usado só em segmentos sem notFound() dinâmico: um loading.tsx acima de uma página
 * faz a resposta começar com HTTP 200 antes de a página decidir que é 404.
 */
export async function LoadingScreen({
  fullScreen = true,
  children,
}: {
  fullScreen?: boolean;
  children?: React.ReactNode;
}) {
  const t = common[await getLocale()].status;
  const label = t.loading.replace(/\.+$/, "");
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("bg-background", fullScreen ? "min-h-dvh" : "min-h-[50vh]", !children && "grid place-items-center")}
    >
      {children ? (
        <>
          {/* O skeleton é só decoração; quem usa leitor de tela ouve este texto */}
          <span className="sr-only">{label}</span>
          <div aria-hidden="true" className="loading-fade">
            {children}
          </div>
        </>
      ) : (
        <div className="loading-fade flex flex-col items-center gap-5">
          <svg viewBox="0 0 50 50" className="loader-ring size-11" aria-hidden="true">
            <circle cx="25" cy="25" r="20" fill="none" strokeWidth="3" className="stroke-border" />
            <circle cx="25" cy="25" r="20" fill="none" strokeWidth="3" strokeLinecap="round" className="loader-arc stroke-brand" />
          </svg>
          <span className="loader-label text-sm text-muted-foreground">{label}</span>
        </div>
      )}
    </div>
  );
}
