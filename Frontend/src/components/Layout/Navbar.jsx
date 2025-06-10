import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold hover:text-blue-200">
          Country Explorer
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="hover:text-blue-200 transition"
          >
            Home
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="hover:text-blue-200 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-200 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-blue-200 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;