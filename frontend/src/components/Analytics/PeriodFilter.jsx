import React from 'react';

const PeriodFilter = ({ selectedPeriod, onPeriodChange }) => {
  const periods = [
    { id: 'all', label: 'Todo', icon: '📅', desc: 'Historial completo' },
    { id: '7', label: '7 días', icon: '📊', desc: 'Última semana' },
    { id: '30', label: '30 días', icon: '📈', desc: 'Último mes' }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6 animate-slide-down">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-white font-bold text-lg">📆 Período:</h3>
          <span className="text-purple-300 text-sm hidden md:inline">
            Filtra tus estadísticas
          </span>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {periods.map((period, index) => (
            <button
              key={period.id}
              onClick={() => onPeriodChange(period.id)}
              className={`group relative px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 animate-scale-in ${
                selectedPeriod === period.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">{period.icon}</span>
                <span>{period.label}</span>
              </span>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {period.desc}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
              </div>
              
              {/* Indicator activo */}
              {selectedPeriod === period.id && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse-slow"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeriodFilter;
