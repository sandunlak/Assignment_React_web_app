import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useFavorites from '../context/useFavorites';

const Dashboard = () => {
  const userName = "";
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { favorites, toggleFavorite } = useFavorites();
  

  // Fetch all products or by category
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        let url = 'https://fakestoreapi.com/products';
        if (category) {
          url = `https://fakestoreapi.com/products/category/${category}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch products');
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response format from server');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Unexpected response data format');
        }
        // Validate product IDs
        const validProducts = data.filter(product => product.id && !isNaN(parseInt(product.id)));
        if (validProducts.length === 0) {
          throw new Error('No valid products found');
        }
        if (data.length !== validProducts.length) {
          console.warn('Invalid products filtered out:', data.filter(p => !p.id || isNaN(parseInt(p.id))));
        }
        setProducts(validProducts);
        if (!category) {
          setAllProducts(validProducts);
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  // Search by product
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setCategory('');
      setProducts(allProducts);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const filteredProducts = allProducts.filter((product) =>
        product.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredProducts.length === 0) throw new Error('No products found');
      setProducts(filteredProducts);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen fixed inset-0 bg-gradient-to-br from-rose-50 to-rose-100 overflow-auto">
      <header className="w-full bg-teal-600 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-3 md:mb-0 w-full md:w-auto justify-between md:justify-start">
            <h1 className="text-xl md:text-2xl font-bold text-white">ShopWorld</h1>
            <div className="flex space-x-1 md:ml-4"></div>
          </div>
          <nav className="flex justify-center items-center space-x-4">
            <Link to="/" className="text-white hover:text-rose-100 transition text-sm md:text-base">Home</Link>
            <Link to="/dashboard" className="text-white hover:text-rose-100 transition text-sm md:text-base">Dashboard</Link>
            <Link to="/favorites" className="text-white hover:text-rose-100 transition text-sm md:text-base">Favorites ({favorites.length})</Link>
            
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pt-20 md:pt-24">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-700">Welcome! {userName}</h2>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <form onSubmit={handleSearch} className="w-full sm:w-80">
  <div className="flex">
    <input
      type="text"
      placeholder="Search for a product..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="flex-1 px-4 py-2 border border-black rounded-l focus:outline-none text-black bg-[#ffffff] text-sm w-full"
    />
    <button
      type="submit"
      className="bg-teal-600 text-white px-4 py-2 rounded-r hover:bg-teal-500 transition text-sm"
    >
      Search
    </button>
  </div>
</form>

          <div className="w-full sm:w-auto flex justify-end">
            <select
              value={category}
              onChange={(e) => {
                setSearchTerm('');
                setCategory(e.target.value);
              }}
              className="px-4 py-2 border rounded focus:outline-none text-sm bg-white text-gray-700 w-full sm:w-40"
            >
              <option value="">Filter by Category</option>
              <option value="electronics">Electronics</option>
              <option value="jewelery">Jewelery</option>
              <option value="men's clothing">Men's Clothing</option>
              <option value="women's clothing">Women's Clothing</option>
            </select>
          </div>
        </div>

        {error && <p className="text-white bg-rose-500 p-3 rounded mb-4 text-center">{error}</p>}

        {loading ? (
          <div className="flex items-center justify-center p-10">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-rose-300 rounded-full mb-4"></div>
              <p className="text-rose-800 text-center">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <p className="text-rose-800 text-center">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group overflow-hidden"
              >
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-2 right-2 z-10 p-1 bg-white/80 rounded-full"
                  aria-label={favorites.includes(product.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  {favorites.includes(product.id) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400 hover:text-yellow-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  )}
                </button>

                <div className="relative overflow-hidden h-48">
                  <img
                    src={product.image || "/api/placeholder/400/200"}
                    alt={product.title || 'Product Image'}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
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

                <div className="p-4 transition-all duration-300 group-hover:bg-rose-50">
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

export default Dashboard;