import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useFavorites from '../context/useFavorites';

const Favorites = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (favorites.length === 0) {
      setLoading(false);
      setFavoriteProducts([]);
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);
      try {
        const responses = await Promise.all(
          favorites.map(id =>
            fetch(`https://fakestoreapi.com/products/${id}`)
              .then(res => {
                if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
                return res.json();
              })
              .catch(error => {
                console.error(error);
                return null;
              })
          )
        );

        const validProducts = responses.filter(product => product !== null && product.id);
        if (validProducts.length !== favorites.length) {
          setError(`Could not load all favorite products (${favorites.length - validProducts.length} failed)`);
        }
        setFavoriteProducts(validProducts);
      } catch (error) {
        console.error("Error fetching favorite products:", error);
        setError("Failed to load favorite products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites]);

  return (
    <div className="h-screen w-screen fixed inset-0 bg-gradient-to-br from-rose-50 to-rose-100 overflow-auto">
      {/* Header */}
      <header className="w-full bg-teal-600 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-3 md:mb-0 w-full md:w-auto justify-between md:justify-start">
            <h1 className="text-xl md:text-2xl font-bold text-white">ShopWorld</h1>
            <div className="flex space-x-1 md:ml-4"></div>
          </div>
          <nav className="flex flex-wrap justify-center items-center gap-2 md:gap-6 w-full md:w-auto">
            <Link to="/" className="text-white hover:text-blue-100 transition text-sm md:text-base">Home</Link>
            <Link to="/dashboard" className="text-white hover:text-blue-100 transition text-sm md:text-base">Dashboard</Link>
            <Link to="/favorites" className="text-white hover:text-blue-100 transition text-sm md:text-base">Favorites ({favorites.length})</Link>
            
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pt-20 md:pt-24">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-700">Your Favorite Products</h2>
          <Link
            to="/dashboard"
            className="bg-white text-gray-700 px-4 py-2 rounded-md hover:bg-blue-50 transition text-sm md:text-base"
          >
            Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6 text-center">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
            <p className="text-center text-white text-lg">Loading your favorite products...</p>
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 bg-white/10 rounded-lg max-w-2xl mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-xl text-white mt-4 text-center">No favorite products yet</h3>
            <p className="text-white/80 mt-2 text-center">Click the star icon on products to add them to your favorites</p>
            <Link
              to="/dashboard"
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => (
              <div
                key={product.id}
                className="relative bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-2 right-2 z-10 p-1 bg-white/80 rounded-full"
                  aria-label="Remove from favorites"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00Chaos-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>

                <div className="relative overflow-hidden h-48">
                  <img
                    src={product.image || "/api/placeholder/400/200"}
                    alt={product.title || 'Product Image'}
                    className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">
                      {product.title || 'Untitled Product'}
                    </h3>
                    <p className="text-white/90 text-sm">{product.category || 'Uncategorized'}</p>
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-gray-700 space-y-2">
                    <div className="flex flex-wrap">
                      <span className="font-medium w-24">Price:</span>
                      <span className="flex-1">${product.price ? product.price.toFixed(2) : 'N/A'}</span>
                    </div>
                  </div>

                  
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;