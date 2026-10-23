import { LoadingScreen } from "@/components/status/loading-screen";
import { Skeleton } from "@/components/ui/skeleton";

const ROWS = [0, 1, 2, 3, 4];

export default function Loading() {
  return (
    <LoadingScreen>
      <div className="mx-auto w-full max-w-3xl px-4 pt-16 pb-28 sm:pt-32">
        <div className="flex flex-col gap-3 border-b border-border pb-10">
          <Skeleton className="h-10 w-48 sm:h-12" />
          <Skeleton className="h-6 w-full max-w-md" />
        </div>

        <ul className="flex flex-col">
          {ROWS.map((row) => (
            <li key={row} className="grid gap-2 border-b border-border py-8 sm:grid-cols-[10rem_1fr] sm:gap-8">
              <Skeleton className="h-4 w-20" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </LoadingScreen>
  );
}
