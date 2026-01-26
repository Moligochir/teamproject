export const Loading = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card-bg rounded-2xl border border-card-border p-8 mb-8 animate-pulse">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="w-32 h-32 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-64"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-40"></div>
            </div>
            <div className="flex gap-6">
              <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>

        <div className="bg-card-bg rounded-2xl border border-card-border p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 dark:bg-gray-700 rounded-xl h-48 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
