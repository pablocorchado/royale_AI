import React, { useState, useEffect } from 'react';
import { clashService } from '../services/api';

const DeckRecommendations = ({ playerTag }) => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadRecommendations();
  }, [playerTag]);

  const loadRecommendations = async () => {
    if (!playerTag) return;

    setLoading(true);
    setError('');

    try {
      const result = await clashService.getDeckRecommendations(playerTag);
      if (result.success) {
        setRecommendations(result.data.recommendations);
      }
    } catch (err) {
      setError('Error al generar recomendaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const parseRecommendations = (text) => {
    if (!text) return [];
    
    const sections = [];
    const lines = text.split('\n');
    let currentSection = { title: '', content: [] };
    
    lines.forEach(line => {
      if (line.match(/^\*\*\d+\.|^#{1,3}\s|^MAZO/i)) {
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
    
    return sections.length > 0 ? sections : [{ title: 'Recomendaciones', content: text.split('\n') }];
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mb-4"></div>
        <p className="text-xl text-white">Generando recomendaciones de mazos con IA...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/90 backdrop-blur text-white rounded-xl p-6">
        <p className="text-lg">{error}</p>
        <button
          onClick={loadRecommendations}
          className="mt-4 px-6 py-2 bg-white text-red-500 rounded-lg font-bold hover:bg-gray-100"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const sections = parseRecommendations(recommendations);

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-black text-white mb-2">
          🎴 Recomendaciones de Mazos
        </h3>
        <p className="text-blue-200 text-lg">Mazos optimizados para tus cartas y el meta actual</p>
      </div>

      {sections.map((section, index) => (
        <div
          key={index}
          className="bg-white/95 backdrop-blur rounded-2xl p-6 hover:shadow-2xl transition-all"
        >
          <h4 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h4>
          <div className="space-y-2">
            {section.content.map((line, i) => (
              <p key={i} className="text-gray-700 leading-relaxed">{line}</p>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center pt-4">
        <button
          onClick={loadRecommendations}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-lg"
        >
          🔄 Generar Nuevas Recomendaciones
        </button>
      </div>
    </div>
  );
};

export default DeckRecommendations;