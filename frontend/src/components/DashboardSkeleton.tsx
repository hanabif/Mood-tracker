interface DashboardContentSkeletonProps {
  variant?: 'home' | 'calendar' | 'insights' | 'trends' | 'page';
}

const Block = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-2xl bg-purple-100/80 dark:bg-gray-700/70 ${className}`} />
);

export const DashboardContentSkeleton = ({ variant = 'home' }: DashboardContentSkeletonProps) => (
  <div role="status" aria-label="Loading dashboard" className="space-y-5">
    <span className="sr-only">Loading your mood data…</span>
    <div className="space-y-2">
      <Block className="h-7 w-48" />
      <Block className="h-4 w-64 max-w-full rounded-lg" />
    </div>
    {variant === 'home' && <Block className="h-28 w-full" />}
    {variant === 'calendar' && <Block className="h-[460px] w-full" />}
    {variant === 'trends' && <Block className="h-[380px] w-full" />}
    {variant === 'insights' && <div className="grid gap-4 sm:grid-cols-2"><Block className="h-44" /><Block className="h-44" /><Block className="h-52" /><Block className="h-72" /></div>}
    {variant === 'page' && <><Block className="h-28 w-full" /><Block className="h-48 w-full" /></>}
    {variant === 'home' && <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]"><Block className="h-52" /><Block className="h-64" /></div>}
  </div>
);

export const DashboardSkeleton = () => (
  <div className="min-h-screen md:flex">
    <div className="border-b border-white/80 bg-white/75 p-4 dark:border-gray-700/60 dark:bg-[#222231]/90 md:h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r md:p-5">
      <Block className="h-8 w-40" />
      <div className="mt-8 hidden space-y-2 md:block">
        {[1, 2, 3, 4, 5, 6].map((item) => <Block key={item} className="h-10 w-full rounded-xl" />)}
      </div>
      <div className="mt-4 flex gap-2 md:hidden">
        {[1, 2, 3].map((item) => <Block key={item} className="h-9 w-28 rounded-xl" />)}
      </div>
    </div>
    <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 md:px-8 md:py-7">
      <DashboardContentSkeleton />
    </main>
  </div>
);
