import React, { useState, useEffect } from 'react';
import { clashService } from '../services/api';
import Tabs from './Tabs';
import CardsCollection from './CardsCollection';
import BattleHistory from './BattleHistory';
import DeckRecommendations from './DeckRecommendations';
import TrophyChart from './Analytics/TrophyChart';
import WinRateChart from './Analytics/WinRateChart';
import WinsLossesChart from './Analytics/WinsLossesChart';
import ThreeCrownsChart from './Analytics/ThreeCrownsChart';
import PeriodFilter from './Analytics/PeriodFilter';
import LoadingSkeleton from './LoadingSkeleton';

const DashboardV2 = () => {
  const [playerTag, setPlayerTag] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [filteredHistory, setFilteredHistory] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (profileData) {
      loadHistory();
    }
  }, [profileData]);

  // Filtrar cuando cambia el historial o el período seleccionado
  useEffect(() => {
    if (historyData && historyData.length > 0) {
      filterHistory(selectedPeriod);
    }
  }, [historyData, selectedPeriod]);

  const filterHistory = (period) => {
    if (!historyData || historyData.length === 0) {
      setFilteredHistory([]);
      return;
    }

    console.log('🔍 Filtrando por período:', period);
    console.log('📊 Datos totales:', historyData.length);

    if (period === 'all') {
      setFilteredHistory(historyData);
      console.log('✅ Mostrando todos:', historyData.length);
      return;
    }

    const days = parseInt(period);
    const filtered = historyData.slice(-days);
    setFilteredHistory(filtered);
    console.log(`✅ Mostrando últimos ${days} días:`, filtered.length);
  };

  const handlePeriodChange = (period) => {
    console.log('🔘 Cambiando período a:', period);
    setSelectedPeriod(period);
  };

  const loadHistory = async () => {
    if (!profileData?.player?.tag) {
      console.log('⚠️ No hay player tag disponible');
      return;
    }
    
    try {
      console.log('🔍 Cargando historial para:', profileData.player.tag);
      const response = await clashService.getHistory(profileData.player.tag, 30);
      console.log('📊 Historial cargado:', response);
      setHistoryData(response.data);
    } catch (err) {
      console.log('⚠️ No se pudo cargar historial:', err.message);
      setHistoryData(null);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!playerTag.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await clashService.getCompleteProfile(playerTag);
      const data = response.data || response;
      setProfileData(data);
      setActiveTab('overview');
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error al obtener el perfil');
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: '🏠 Resumen' },
    { id: 'analytics', label: '📊 Analytics' },
    { id: 'analysis', label: '🤖 Análisis IA' },
    { id: 'cards', label: '🎴 Cartas' },
    { id: 'battles', label: '⚔️ Batallas' },
    { id: 'decks', label: '🃏 Mazos' }
  ];

  const player = profileData?.player || {};
  const hasValidData = player && player.name;

  // Usar filteredHistory en lugar de historyData
  const trophyHistory = filteredHistory && filteredHistory.length > 0 
    ? filteredHistory.map(snap => ({
        trophies: snap.trophies,
        bestTrophies: snap.best_trophies
      }))
    : (player.trophies ? [
        { trophies: player.trophies - 200, bestTrophies: player.bestTrophies },
        { trophies: player.trophies - 150, bestTrophies: player.bestTrophies },
        { trophies: player.trophies - 100, bestTrophies: player.bestTrophies },
        { trophies: player.trophies - 50, bestTrophies: player.bestTrophies },
        { trophies: player.trophies, bestTrophies: player.bestTrophies },
      ] : []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-2 drop-shadow-lg animate-bounce-subtle">
            🏆 CLASH COACH V3.1.2
          </h1>
          <p className="text-purple-200 text-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Analytics Avanzado · Polish & Perfection
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-purple-300 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>Sistema activo</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-2xl animate-scale-in hover:shadow-purple-500/20 transition-shadow duration-300">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={playerTag}
              onChange={(e) => setPlayerTag(e.target.value)}
              placeholder="Player Tag (ej: #L0QLYR2P)"
              className="flex-1 px-6 py-4 rounded-xl text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Buscando...
                </span>
              ) : (
                '🔍 Buscar'
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border-2 border-red-500 rounded-xl animate-slide-down">
              <p className="text-red-200 font-semibold flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                <span>{error}</span>
              </p>
            </div>
          )}

          {historyData && historyData.length > 0 && (
            <div className="mt-4 p-3 bg-green-500/20 border border-green-500 rounded-xl animate-slide-down">
              <p className="text-green-200 text-sm flex items-center gap-2">
                <span className="text-lg animate-pulse">📊</span>
                <span>
                  Historial cargado: <strong>{historyData.length}</strong> snapshots | 
                  Mostrando: <strong>{filteredHistory?.length || 0}</strong> snapshots
                </span>
              </p>
            </div>
          )}
        </div>

        {loading && <LoadingSkeleton />}

        {!loading && hasValidData && (
          <div className="space-y-6 animate-slide-up">
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-black text-white">
                    👤 {player.name}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-purple-500/30 to-purple-600/30 p-4 rounded-xl transform hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                      <p className="text-purple-200 text-sm">Trofeos</p>
                      <p className="text-white text-3xl font-bold">
                        🏆 {player.trophies?.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-500/30 to-yellow-600/30 p-4 rounded-xl transform hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                      <p className="text-yellow-200 text-sm">Mejor</p>
                      <p className="text-white text-3xl font-bold">
                        ⭐ {player.bestTrophies?.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500/30 to-blue-600/30 p-4 rounded-xl transform hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                      <p className="text-blue-200 text-sm">Win Rate</p>
                      <p className="text-white text-3xl font-bold">
                        📈 {((player.wins / (player.wins + player.losses)) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <PeriodFilter 
                    selectedPeriod={selectedPeriod}
                    onPeriodChange={handlePeriodChange}
                  />
                  
                  <TrophyChart data={trophyHistory} />
                  <WinsLossesChart data={filteredHistory} />
                  <ThreeCrownsChart data={filteredHistory} />
                  <WinRateChart battleStats={profileData.battle_stats} />
                </div>
              )}

              {activeTab === 'analysis' && (
                <div className="text-white">
                  <h2 className="text-3xl font-black mb-4">🤖 Análisis con IA</h2>
                  <p className="text-purple-200">Próximamente...</p>
                </div>
              )}

              {activeTab === 'cards' && profileData.cards_analysis && (
                <CardsCollection cardsData={profileData.cards_analysis} />
              )}

              {activeTab === 'battles' && profileData.battle_stats && (
                <BattleHistory 
                  battleStats={profileData.battle_stats}
                  battles={profileData.battles}
                />
              )}

              {activeTab === 'decks' && profileData.deck_recommendations && (
                <DeckRecommendations decks={profileData.deck_recommendations} />
              )}
            </div>
          </div>
        )}

        {!hasValidData && !loading && (
          <div className="text-center mt-20">
            <div className="text-8xl mb-4">🎮</div>
            <p className="text-white text-2xl font-bold">¡Comienza tu análisis!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardV2;
