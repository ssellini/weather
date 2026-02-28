export function SkeletonCard() {
  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 animate-pulse">
      <div className="h-4 w-20 bg-gray-200 dark:bg-white/10 rounded mb-3" />
      <div className="h-8 w-28 bg-gray-200 dark:bg-white/10 rounded mb-2" />
      <div className="h-3 w-24 bg-gray-200 dark:bg-white/10 rounded" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="rounded-2xl p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 animate-pulse">
      <div className="h-5 w-40 bg-gray-200 dark:bg-white/10 rounded mb-6" />
      <div className="h-64 bg-gray-200 dark:bg-white/10 rounded" />
    </div>
  );
}

export default function LoadingSkeleton({ progress }) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {progress > 0 && progress < 1 && (
        <div className="mb-8">
          <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-400 mt-2 font-mono">
            {Math.round(progress * 100)}%
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <SkeletonChart />
    </div>
  );
}
