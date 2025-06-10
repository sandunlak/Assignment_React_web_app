import { useState, useEffect } from 'react';

const useFavorites = () => {
  const [favorites, setFavorites] = useState(() => {
    
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('countryFavorites');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  
  useEffect(() => {
    localStorage.setItem('countryFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (countryCode) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(countryCode)
        ? prev.filter(code => code !== countryCode)
        : [...prev, countryCode];
      return newFavorites;
    });
  };

  return { favorites, toggleFavorite };
};

export default useFavorites;