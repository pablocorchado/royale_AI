import React from 'react';

const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 mb-6 animate-slide-down">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-6 py-3 font-semibold text-base transition-all whitespace-nowrap rounded-lg
              transform hover:scale-105 active:scale-95
              animate-scale-in
              ${activeTab === tab.id
                ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50'
                : 'text-white/70 hover:text-white hover:bg-white/10'
              }
            `}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <span className="flex items-center gap-2">
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </span>
            
            {/* Indicador activo */}
            {activeTab === tab.id && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse-slow"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;