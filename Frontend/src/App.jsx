import { useAuth } from './context/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Navbar from './components/Layout/Navbar';
import Favorites from './pages/Favorites';
import './App.css';

function App() {
  const { user } = useAuth();

  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/dashboard" /> : <Register />} 
        />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/favorites" 
          element={user ? <Favorites /> : <Navigate to="/login" />} 
        />
        
      </Routes>
    </div>
  );
}

export default App;