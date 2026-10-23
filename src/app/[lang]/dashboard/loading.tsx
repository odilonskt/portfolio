import { LoadingScreen } from "@/components/status/loading-screen";
import { Skeleton } from "@/components/ui/skeleton";

const ROWS = [0, 1, 2, 3];

// Dentro do layout do painel: o cabeçalho continua visível durante o carregamento
export default function Loading() {
  return (
    <LoadingScreen fullScreen={false}>
      <div className="flex flex-col gap-6">
        <div className="mb-2 flex flex-col gap-1">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-5 w-64" />
        </div>

        <div className="grid grid-cols-3 divide-x divide-border rounded-xl border border-border">
          {ROWS.slice(0, 3).map((stat) => (
            <div key={stat} className="flex flex-col-reverse gap-1 px-4 py-4 sm:px-6">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-7 w-10" />
            </div>
          ))}
        </div>

        <div className="flex w-fit gap-1 rounded-md border border-border p-1">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>

        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
          {ROWS.map((row) => (
            <li key={row} className="grid grid-cols-[auto_1fr_auto] items-start gap-3 px-4 py-4 sm:px-5">
              <Skeleton className="mt-2 size-2 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-56" />
              </div>
              <Skeleton className="h-3 w-10" />
            </li>
          ))}
        </ul>
      </div>
    </LoadingScreen>
  );
}
