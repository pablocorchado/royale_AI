import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

const WinRateChart = ({ battleStats }) => {
  if (!battleStats || !battleStats.by_game_mode) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center">
        <p className="text-white text-lg">
          📊 No hay estadísticas de batallas disponibles
        </p>
      </div>
    );
  }

  // Convertir datos para la gráfica
  const chartData = Object.keys(battleStats.by_game_mode).map(mode => {
    const stats = battleStats.by_game_mode[mode];
    return {
      name: mode,
      wins: stats.wins || 0,
      losses: (stats.total || 0) - (stats.wins || 0),
      winRate: stats.win_rate || 0
    };
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900/90 backdrop-blur-sm border border-purple-500 rounded-lg p-4 shadow-xl">
          <p className="text-white font-bold mb-2">{data.name}</p>
          <p className="text-green-400">
            ✅ Victorias: <span className="font-bold text-white">{data.wins}</span>
          </p>
          <p className="text-red-400">
            ❌ Derrotas: <span className="font-bold text-white">{data.losses}</span>
          </p>
          <p className="text-yellow-400">
            📈 Win Rate: <span className="font-bold text-white">{data.winRate}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Colores basados en win rate
  const getBarColor = (winRate) => {
    if (winRate >= 60) return '#22c55e'; // Verde
    if (winRate >= 50) return '#eab308'; // Amarillo
    return '#ef4444'; // Rojo
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        ⚔️ Win Rate por Modo de Juego
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
          
          <XAxis 
            dataKey="name" 
            stroke="#ffffff80"
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          
          <YAxis 
            stroke="#ffffff80"
            style={{ fontSize: '12px' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend wrapperStyle={{ color: '#fff' }} />
          
          <Bar 
            dataKey="wins" 
            fill="#22c55e" 
            name="Victorias"
            radius={[8, 8, 0, 0]}
          />
          
          <Bar 
            dataKey="losses" 
            fill="#ef4444" 
            name="Derrotas"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Win Rate Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {chartData.map((mode, index) => (
          <div 
            key={index}
            className="bg-white/5 rounded-lg p-4 border-l-4"
            style={{ borderColor: getBarColor(mode.winRate) }}
          >
            <p className="text-white font-semibold">{mode.name}</p>
            <p className="text-2xl font-bold" style={{ color: getBarColor(mode.winRate) }}>
              {mode.winRate}%
            </p>
            <p className="text-xs text-gray-400">
              {mode.wins}W - {mode.losses}L
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WinRateChart;
