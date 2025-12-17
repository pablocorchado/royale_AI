import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

const TrophyChart = ({ data }) => {
  // Si no hay datos, mostrar mensaje
  if (!data || data.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center">
        <p className="text-white text-lg">
          📊 No hay datos históricos disponibles aún
        </p>
        <p className="text-purple-200 text-sm mt-2">
          Los datos se guardarán automáticamente en futuras sesiones
        </p>
      </div>
    );
  }

  // Formatear datos para la gráfica
  const chartData = data.map((item, index) => ({
    name: `Día ${index + 1}`,
    trophies: item.trophies || 0,
    bestTrophies: item.bestTrophies || 0
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/90 backdrop-blur-sm border border-purple-500 rounded-lg p-4 shadow-xl">
          <p className="text-white font-bold mb-2">{payload[0].payload.name}</p>
          <p className="text-purple-400">
            🏆 Trofeos: <span className="font-bold text-white">{payload[0].value}</span>
          </p>
          {payload[1] && (
            <p className="text-yellow-400">
              ⭐ Mejor: <span className="font-bold text-white">{payload[1].value}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Calcular tendencia
  const trend = chartData.length > 1 
    ? chartData[chartData.length - 1]?.trophies - chartData[0]?.trophies
    : 0;
  
  const trendIcon = trend > 0 ? '📈' : trend < 0 ? '📉' : '➡️';
  const trendColor = trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-yellow-400';

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 animate-scale-in hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          📈 Progreso de Trofeos
        </h3>
        <div className={`flex items-center gap-2 ${trendColor} font-bold`}>
          <span className="text-2xl">{trendIcon}</span>
          <span className="text-lg">
            {trend > 0 ? '+' : ''}{trend}
          </span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorTrophies" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorBest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#eab308" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
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
          
          <Legend 
            wrapperStyle={{ color: '#fff' }}
            iconType="line"
          />
          
          <Area
            type="monotone"
            dataKey="trophies"
            stroke="#a855f7"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorTrophies)"
            name="Trofeos Actuales"
          />
          
          <Area
            type="monotone"
            dataKey="bestTrophies"
            stroke="#eab308"
            strokeWidth={2}
            strokeDasharray="5 5"
            fillOpacity={1}
            fill="url(#colorBest)"
            name="Mejor Record"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Stats summary con animaciones stagger */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-purple-500/20 rounded-lg p-3 text-center transform hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <p className="text-purple-200 text-xs">Actual</p>
          <p className="text-white text-xl font-bold">
            {chartData[chartData.length - 1]?.trophies || 0}
          </p>
        </div>
        
        <div className="bg-yellow-500/20 rounded-lg p-3 text-center transform hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-yellow-200 text-xs">Mejor</p>
          <p className="text-white text-xl font-bold">
            {Math.max(...chartData.map(d => d.bestTrophies))}
          </p>
        </div>
        
        <div className="bg-green-500/20 rounded-lg p-3 text-center transform hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <p className="text-green-200 text-xs">Promedio</p>
          <p className="text-white text-xl font-bold">
            {Math.round(chartData.reduce((a, b) => a + b.trophies, 0) / chartData.length)}
          </p>
        </div>
        
        <div className="bg-blue-500/20 rounded-lg p-3 text-center transform hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-blue-200 text-xs">Cambio</p>
          <p className={`text-xl font-bold ${
            (chartData[chartData.length - 1]?.trophies - chartData[0]?.trophies) >= 0 
              ? 'text-green-400' 
              : 'text-red-400'
          }`}>
            {chartData.length > 1 
              ? (chartData[chartData.length - 1]?.trophies - chartData[0]?.trophies > 0 ? '+' : '')
              + (chartData[chartData.length - 1]?.trophies - chartData[0]?.trophies)
              : '0'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrophyChart;
