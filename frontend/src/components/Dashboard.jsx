import React, { useState } from 'react';
import { clashService } from '../services/api';

const Dashboard = () => {
  const [playerTag, setPlayerTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [playerData, setPlayerData] = useState(null);
  const [analysis, setAnalysis] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!playerTag.trim()) {
      setError('Por favor ingresa un Player Tag');
      return;
    }

    setLoading(true);
    setError('');
    setPlayerData(null);
    setAnalysis('');

    try {
      const result = await clashService.getAnalysis(playerTag);
      
      if (result.success) {
        setPlayerData(result.data.player);
        setAnalysis(result.data.analysis);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || 
        'Error al obtener datos. Verifica que el Player Tag sea correcto.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Parsear el análisis para extraer secciones
  const parseAnalysis = (text) => {
    const sections = [];
    const lines = text.split('\n');
    let currentSection = { title: '', content: [] };
    
    lines.forEach(line => {
      // Detectar títulos (líneas con ** o números al inicio)
      if (line.match(/^\*\*\d+\.|^#{1,3}\s/)) {
        if (currentSection.content.length > 0) {
          sections.push(currentSection);
        }
        currentSection = {
          title: line.replace(/\*\*/g, '').replace(/^#{1,3}\s/, '').trim(),
          content: []
        };
      } else if (line.trim()) {
        currentSection.content.push(line);
      }
    });
    
    if (currentSection.content.length > 0) {
      sections.push(currentSection);
    }
    
    return sections.length > 0 ? sections : [{ title: 'Análisis', content: text.split('\n') }];
  };

  const getSectionIcon = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes('rendimiento') || lower.includes('resumen')) return '📊';
    if (lower.includes('mazo') || lower.includes('deck')) return '🎴';
    if (lower.includes('patrón') || lower.includes('error')) return '🔍';
    if (lower.includes('recomend') || lower.includes('consejo')) return '💡';
    if (lower.includes('matchup') || lower.includes('dificultad')) return '⚔️';
    return '✨';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="text-8xl mb-2 animate-bounce-slow">🏆</div>
          </div>
          <h1 className="text-6xl font-black text-white mb-4 drop-shadow-lg">
            Clash Royale AI Coach
          </h1>
          <p className="text-2xl text-blue-200 font-light">
            Análisis inteligente · Mejora tu gameplay · Domina la arena
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex gap-3 bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20 shadow-2xl">
              <input
                type="text"
                value={playerTag}
                onChange={(e) => setPlayerTag(e.target.value)}
                placeholder="Ingresa tu Player Tag (ej: 2PP)"
                className="flex-1 px-6 py-5 text-xl bg-transparent text-white placeholder-white/60 focus:outline-none"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-5 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold text-xl rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analizando...
                  </span>
                ) : (
                  '🔍 Analizar'
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-500/90 backdrop-blur text-white rounded-xl animate-shake border border-red-400">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-white animate-fade-in">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-full p-8">
                <svg className="animate-spin h-20 w-20 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold mb-2">🤖 Analizando con IA...</p>
            <p className="text-xl text-blue-200">Procesando tus batallas y generando recomendaciones</p>
          </div>
        )}

        {/* Results */}
        {playerData && !loading && (
          <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
            {/* Player Header Card - Más grande y visual */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-1 shadow-2xl">
              <div className="bg-gray-900 rounded-3xl p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <div className="inline-block px-4 py-1 bg-white/10 backdrop-blur rounded-full text-white/80 text-sm mb-3">
                      #{playerData.tag}
                    </div>
                    <h2 className="text-5xl font-black text-white mb-2">
                      {playerData.name}
                    </h2>
                    {playerData.clan && (
                      <div className="flex items-center gap-2 text-blue-300 text-lg justify-center md:justify-start">
                        <span>🛡️</span>
                        <span className="font-semibold">{playerData.clan.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-block bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-transform">
                      <p className="text-6xl font-black text-white mb-1">
                        {playerData.trophies}
                      </p>
                      <p className="text-white/90 font-medium">🏆 Trofeos</p>
                      <p className="text-white/60 text-sm mt-1">
                        Mejor: {playerData.bestTrophies}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-center transform hover:scale-105 transition-all cursor-pointer">
                    <p className="text-4xl font-black text-white mb-2">
                      {playerData.expLevel}
                    </p>
                    <p className="text-blue-100 font-semibold">⭐ Nivel</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-center transform hover:scale-105 transition-all cursor-pointer">
                    <p className="text-4xl font-black text-white mb-2">
                      {playerData.wins}
                    </p>
                    <p className="text-green-100 font-semibold">✅ Victorias</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-6 text-center transform hover:scale-105 transition-all cursor-pointer">
                    <p className="text-4xl font-black text-white mb-2">
                      {playerData.losses}
                    </p>
                    <p className="text-red-100 font-semibold">❌ Derrotas</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-center transform hover:scale-105 transition-all cursor-pointer">
                    <p className="text-4xl font-black text-white mb-2">
                      {Math.round((playerData.wins / (playerData.wins + playerData.losses)) * 100)}%
                    </p>
                    <p className="text-purple-100 font-semibold">📊 Win Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis - Secciones separadas y visuales */}
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-4xl font-black text-white mb-2">
                  🤖 Análisis del Coach IA
                </h3>
                <p className="text-blue-200 text-lg">Recomendaciones personalizadas para mejorar tu juego</p>
              </div>

              {parseAnalysis(analysis).map((section, index) => (
                <div
                  key={index}
                  className="bg-white/95 backdrop-blur rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                >
                  <h4 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                    <span className="text-3xl">{getSectionIcon(section.title)}</span>
                    {section.title}
                  </h4>
                  <div className="prose prose-lg max-w-none">
                    <div className="text-gray-700 leading-relaxed space-y-2">
                      {section.content.map((line, i) => (
                        <p key={i} className="text-lg">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-6">
              <button
                onClick={() => {
                  setPlayerData(null);
                  setAnalysis('');
                  setPlayerTag('');
                }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                ↻ Analizar Otro Jugador
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105"
              >
                🏠 Volver al Inicio
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        {!playerData && !loading && (
          <div className="text-center mt-20 text-white/60">
            <p className="text-lg">Powered by Claude AI × Clash Royale Official API</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
