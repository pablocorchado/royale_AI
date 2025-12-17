import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const WinsLossesChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center">
        <p className="text-white text-lg">
          📊 No hay datos históricos de victorias/derrotas
        </p>
      </div>
    );
  }

  // Formatear datos
  const chartData = data.map((item, index) => ({
    name: `Día ${index + 1}`,
    wins: item.wins || 0,
    losses: item.losses || 0,
    winRate: item.wins && item.losses 
      ? ((item.wins / (item.wins + item.losses)) * 100).toFixed(1)
      : 0
  }));

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

  // Calcular estadísticas adicionales
  const totalWins = chartData[chartData.length - 1]?.wins || 0;
  const totalLosses = chartData[chartData.length - 1]?.losses || 0;
  const winRate = totalWins + totalLosses > 0 
    ? ((totalWins / (totalWins + totalLosses)) * 100).toFixed(1)
    : 0;
  
  const winsGained = chartData.length > 1 
    ? totalWins - (chartData[0]?.wins || 0)
    : 0;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 animate-scale-in hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          ⚔️ Victorias vs Derrotas
        </h3>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-green-300">Ganadas en período</p>
            <p className="text-lg font-bold text-green-400">+{winsGained}</p>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
          
          <XAxis 
            dataKey="name" 
            stroke="#ffffff80"
            style={{ fontSize: '12px' }}
          />
          
          <YAxis 
            stroke="#ffffff80"
            style={{ fontSize: '12px' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend wrapperStyle={{ color: '#fff' }} />
          
          <Line
            type="monotone"
            dataKey="wins"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ fill: '#22c55e', r: 4 }}
            name="Victorias"
          />
          
          <Line
            type="monotone"
            dataKey="losses"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: '#ef4444', r: 4 }}
            name="Derrotas"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Resumen con animaciones */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-green-500/20 rounded-lg p-3 text-center transform hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <p className="text-green-200 text-xs">Total Wins</p>
          <p className="text-white text-2xl font-bold">
            {chartData[chartData.length - 1]?.wins || 0}
          </p>
        </div>
        
        <div className="bg-red-500/20 rounded-lg p-3 text-center transform hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-red-200 text-xs">Total Losses</p>
          <p className="text-white text-2xl font-bold">
            {chartData[chartData.length - 1]?.losses || 0}
          </p>
        </div>
        
        <div className="bg-blue-500/20 rounded-lg p-3 text-center transform hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <p className="text-blue-200 text-xs">Partidas</p>
          <p className="text-white text-2xl font-bold">
            {(chartData[chartData.length - 1]?.wins || 0) + (chartData[chartData.length - 1]?.losses || 0)}
          </p>
        </div>
        
        <div className="bg-yellow-500/20 rounded-lg p-3 text-center transform hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-yellow-200 text-xs">Win Rate</p>
          <p className="text-white text-2xl font-bold">
            {chartData[chartData.length - 1]?.winRate || 0}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default WinsLossesChart;
