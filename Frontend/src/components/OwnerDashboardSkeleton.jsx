import React from 'react';

const Shimmer = ({ className = "" }) => (
  <div className={`bg-gray-200 rounded-xl animate-pulse ${className}`} />
);

function OwnerDashboardSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-10 px-4 sm:px-6 mt-8">

      {/* Stats bar skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-100 border border-gray-200 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex justify-between">
              <Shimmer className="w-8 h-8 rounded-full" />
              <Shimmer className="w-10 h-7" />
            </div>
            <Shimmer className="w-24 h-3" />
          </div>
        ))}
      </div>

      {/* Search bar skeleton */}
      <Shimmer className="w-full h-12 rounded-2xl" />

      {/* Shop card skeleton */}
      {[1, 2].map(i => (
        <div key={i} className="w-full flex flex-col gap-5">
          <div className="bg-white rounded-3xl shadow border border-gray-100 overflow-hidden">
            {/* Cover image skeleton */}
            <Shimmer className="w-full h-52 rounded-none" />
            {/* Bottom row */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex gap-3">
                <Shimmer className="w-20 h-7 rounded-full" />
                <Shimmer className="w-36 h-7 rounded-full" />
              </div>
              <Shimmer className="w-28 h-9 rounded-xl" />
            </div>
          </div>

          {/* Menu header skeleton */}
          <div className="flex justify-between items-center">
            <Shimmer className="w-40 h-6 rounded-lg" />
            <Shimmer className="w-28 h-9 rounded-xl" />
          </div>

          {/* Item cards skeleton */}
          {[1, 2, 3].map(j => (
            <div key={j} className="flex bg-white rounded-2xl shadow border border-gray-100 overflow-hidden w-full">
              <Shimmer className="w-36 h-32 rounded-none flex-shrink-0" />
              <div className="flex flex-col justify-between flex-1 p-4 gap-3">
                <div className="flex justify-between">
                  <Shimmer className="w-40 h-5 rounded-lg" />
                  <Shimmer className="w-4 h-4 rounded-sm" />
                </div>
                <div className="flex gap-2">
                  <Shimmer className="w-20 h-5 rounded-full" />
                  <Shimmer className="w-16 h-5 rounded-full" />
                </div>
                <Shimmer className="w-full h-4 rounded-lg" />
                <div className="flex justify-between items-center mt-1">
                  <Shimmer className="w-24 h-8 rounded-lg" />
                  <div className="flex gap-2">
                    <Shimmer className="w-8 h-8 rounded-xl" />
                    <Shimmer className="w-8 h-8 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="border-b-2 border-dashed border-gray-200 pt-2" />
        </div>
      ))}
    </div>
  );
}

export default OwnerDashboardSkeleton;
