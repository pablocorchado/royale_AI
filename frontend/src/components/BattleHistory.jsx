import React from 'react';

const BattleHistory = ({ battles, battleStats }) => {
  if (!battles || battles.length === 0) return null;

  const getBattleResult = (battle) => {
    const team = battle.team?.[0] || {};
    const opponent = battle.opponent?.[0] || {};
    return team.crowns > opponent.crowns;
  };

  const getBattleTypeIcon = (type) => {
    const icons = {
      'PvP': '⚔️',
      'challenge': '🏆',
      'tournament': '🎯',
      'friendly': '🤝',
      'clanMate': '🛡️',
      'pathOfLegend': '👑',
    };
    return icons[type] || '⚔️';
  };

  return (
    <div className="space-y-6">
      {/* Battle Stats Overview */}
      {battleStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="text-4xl font-black mb-2">{battleStats.wins}</div>
            <div className="text-green-100">✅ Victorias</div>
          </div>
          
          <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-6 text-white">
            <div className="text-4xl font-black mb-2">{battleStats.losses}</div>
            <div className="text-red-100">❌ Derrotas</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
            <div className="text-4xl font-black mb-2">{battleStats.win_rate}%</div>
            <div className="text-purple-100">📊 Win Rate</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white">
            <div className="text-4xl font-black mb-2">{battleStats.total_battles}</div>
            <div className="text-blue-100">🎮 Total Batallas</div>
          </div>
        </div>
      )}

      {/* Top Used Cards */}
      {battleStats?.top_used_cards && (
        <div className="bg-white/95 backdrop-blur rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">🎴 Cartas Más Usadas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {battleStats.top_used_cards.map((card, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
                <div className="font-bold text-gray-800 text-sm mb-2 truncate">{card.name}</div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Usos: {card.uses}</span>
                  <span className="text-green-600 font-bold">
                    {Math.round((card.wins / card.uses) * 100)}% WR
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Battle List */}
      <div className="bg-white/95 backdrop-blur rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">📜 Últimas Batallas</h3>
        <div className="space-y-3">
          {battles.slice(0, 15).map((battle, index) => {
            const isWin = getBattleResult(battle);
            const team = battle.team?.[0] || {};
            const opponent = battle.opponent?.[0] || {};
            
            return (
              <div
                key={index}
                className={`rounded-xl p-4 border-2 transition-all hover:shadow-lg ${
                  isWin
                    ? 'bg-green-50 border-green-300'
                    : 'bg-red-50 border-red-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getBattleTypeIcon(battle.type)}</span>
                    <div>
                      <span className={`font-bold text-lg ${isWin ? 'text-green-700' : 'text-red-700'}`}>
                        {isWin ? '✅ VICTORIA' : '❌ DERROTA'}
                      </span>
                      <p className="text-sm text-gray-600">{battle.type}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">
                      {team.crowns} - {opponent.crowns}
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(battle.battleTime).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                
                {/* Cards used */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {team.cards?.slice(0, 8).map((card, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200"
                    >
                      {card.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BattleHistory;