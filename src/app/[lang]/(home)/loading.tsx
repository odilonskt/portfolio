import { LoadingScreen } from "@/components/status/loading-screen";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <LoadingScreen>
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-5xl flex-col items-center justify-center gap-10 px-4 pt-24 pb-16 sm:px-6 lg:flex-row lg:gap-16">
        <Skeleton className="size-44 shrink-0 rounded-3xl sm:size-56 md:size-64" />

        <div className="flex w-full max-w-xl flex-col items-center gap-6 lg:items-start">
          <div className="flex w-full flex-col items-center gap-3 lg:items-start">
            <Skeleton className="h-10 w-56 sm:h-14 sm:w-72" />
            <Skeleton className="h-6 w-36" />
          </div>

          <div className="flex w-full max-w-prose flex-col items-center gap-2 lg:items-start">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="flex gap-8">
            <Skeleton className="h-10 w-14" />
            <Skeleton className="h-10 w-14" />
            <Skeleton className="h-10 w-14" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Skeleton className="h-10 w-36 rounded-md" />
            <Skeleton className="size-10 rounded-md" />
            <Skeleton className="size-10 rounded-md" />
            <Skeleton className="h-10 w-40 rounded-md" />
          </div>
        </div>
      </div>
    </LoadingScreen>
  );
}
