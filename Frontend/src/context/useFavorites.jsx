import { useState, useEffect } from 'react';

const useFavorites = () => {
  const [favorites, setFavorites] = useState(() => {
    
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('productFavorites');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  
  useEffect(() => {
    localStorage.setItem('productFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (productCode) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(productCode)
        ? prev.filter(code => code !== productCode)
        : [...prev, productCode];
      return newFavorites;
    });
  };

  return { favorites, toggleFavorite };
};

export default useFavorites;