import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const ThreeCrownsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center">
        <p className="text-white text-lg">
          👑 No hay datos de Three Crowns
        </p>
      </div>
    );
  }

  const chartData = data.map((item, index) => ({
    name: `Día ${index + 1}`,
    threeCrowns: item.three_crown_wins || 0
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/90 backdrop-blur-sm border border-yellow-500 rounded-lg p-4 shadow-xl">
          <p className="text-white font-bold mb-2">{payload[0].payload.name}</p>
          <p className="text-yellow-400">
            👑 Three Crowns: <span className="font-bold text-white">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const totalGained = chartData.length > 1 
    ? chartData[chartData.length - 1].threeCrowns - chartData[0].threeCrowns
    : 0;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        👑 Victorias de 3 Coronas
      </h3>
      
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorThreeCrowns" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
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
          
          <Area
            type="monotone"
            dataKey="threeCrowns"
            stroke="#fbbf24"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorThreeCrowns)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-yellow-500/20 rounded-lg p-4 text-center">
          <p className="text-yellow-200 text-sm">Total</p>
          <p className="text-white text-3xl font-bold">
            👑 {chartData[chartData.length - 1]?.threeCrowns || 0}
          </p>
        </div>
        
        <div className={`${totalGained >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-lg p-4 text-center`}>
          <p className={`${totalGained >= 0 ? 'text-green-200' : 'text-red-200'} text-sm`}>
            Ganadas en período
          </p>
          <p className={`${totalGained >= 0 ? 'text-green-400' : 'text-red-400'} text-3xl font-bold`}>
            {totalGained >= 0 ? '+' : ''}{totalGained}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThreeCrownsChart;
