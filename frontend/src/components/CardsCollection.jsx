import React, { useState } from 'react';

const CardsCollection = ({ cardsAnalysis }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('level');

  if (!cardsAnalysis) return null;

  const { sorted_by_level, by_rarity, total_cards, avg_level, max_level_cards } = cardsAnalysis;

  const getRarityColor = (rarity) => {
    const colors = {
      'Common': 'from-gray-400 to-gray-600',
      'Rare': 'from-orange-400 to-orange-600',
      'Epic': 'from-purple-400 to-purple-600',
      'Legendary': 'from-yellow-400 to-yellow-600',
      'Champion': 'from-blue-400 to-blue-600',
    };
    return colors[rarity] || 'from-gray-400 to-gray-600';
  };

  const getCardsToDisplay = () => {
    if (filter === 'all') return sorted_by_level;
    return by_rarity[filter] || [];
  };

  const cardsToShow = getCardsToDisplay();

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="text-4xl font-black mb-2">{total_cards}</div>
          <div className="text-blue-100">🎴 Total de Cartas</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="text-4xl font-black mb-2">{avg_level.toFixed(1)}</div>
          <div className="text-purple-100">📊 Nivel Promedio</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="text-4xl font-black mb-2">{max_level_cards.length}</div>
          <div className="text-orange-100">⭐ Nivel Máximo (14+)</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-white text-gray-900'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            🎴 Todas ({sorted_by_level.length})
          </button>
          
          {Object.entries(by_rarity).map(([rarity, cards]) => (
            cards.length > 0 && (
              <button
                key={rarity}
                onClick={() => setFilter(rarity)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === rarity
                    ? 'bg-white text-gray-900'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {rarity === 'Common' && '⚪'}
                {rarity === 'Rare' && '🟠'}
                {rarity === 'Epic' && '🟣'}
                {rarity === 'Legendary' && '🟡'}
                {rarity === 'Champion' && '🔵'}
                {' '}{rarity} ({cards.length})
              </button>
            )
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {cardsToShow.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer"
          >
            {/* Card Icon Placeholder */}
            <div className={`bg-gradient-to-br ${getRarityColor(card.rarity)} rounded-lg h-24 mb-3 flex items-center justify-center text-white font-bold text-3xl`}>
              {card.name.charAt(0)}
            </div>
            
            {/* Card Info */}
            <h4 className="font-bold text-gray-800 text-sm mb-1 truncate">
              {card.name}
            </h4>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">{card.rarity}</span>
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                Nv. {card.level}
              </span>
            </div>
            
            {card.starLevel > 0 && (
              <div className="mt-2 text-yellow-500 text-xs">
                {'⭐'.repeat(card.starLevel)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardsCollection;