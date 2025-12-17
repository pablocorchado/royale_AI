import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-gradient-to-r from-white/10 via-white/20 to-white/10 bg-[length:200%_100%] p-4 rounded-xl animate-shimmer">
    <div className="h-4 bg-white/30 rounded w-1/3 mb-2"></div>
    <div className="h-8 bg-white/40 rounded w-2/3"></div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 overflow-hidden relative">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
    <div className="relative z-10">
      <div className="h-6 bg-white/20 rounded w-1/4 mb-6"></div>
      <div className="h-64 bg-white/10 rounded"></div>
      <div className="grid grid-cols-4 gap-4 mt-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-white/10 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="space-y-6">
    {/* Header skeleton con animación */}
    <div className="h-10 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 bg-[length:200%_100%] rounded w-1/3 animate-shimmer"></div>
    
    {/* Stats grid skeleton con delay stagger */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div 
          key={i} 
          className="animate-slide-up"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <CardSkeleton />
        </div>
      ))}
    </div>
    
    {/* Charts skeleton con animaciones */}
    <div className="space-y-6">
      <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
        <ChartSkeleton />
      </div>
      <div className="animate-scale-in" style={{ animationDelay: '0.5s' }}>
        <ChartSkeleton />
      </div>
    </div>
  </div>
);

const LoadingSkeleton = () => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white font-semibold">Cargando datos...</p>
      </div>
      <ProfileSkeleton />
    </div>
  );
};

export default LoadingSkeleton;
