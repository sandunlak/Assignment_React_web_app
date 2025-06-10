import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find(u => u.email === email && u.password === password);

      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

     
      const token = btoa(`${email}:${Date.now()}`);
      
      setUser(foundUser);
      setToken(token);
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (error) {
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  };

  const register = async (formData) => {
    try {
      
      const userData = {};
      formData.forEach((value, key) => {
        userData[key] = value;
      });

      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some(u => u.email === userData.email)) {
        throw new Error('Email already registered');
      }

      
      const newUser = {
        email: userData.email,
        password: userData.password,
        name: userData.name || '',
        id: Date.now().toString()
      };

      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      
      const token = btoa(`${userData.email}:${Date.now()}`);
      
      setUser(newUser);
      setToken(token);
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const checkAuth = () => {
    try {
      if (!token) {
        throw new Error('No token');
      }

      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const decodedToken = atob(token);
      const email = decodedToken.split(':')[0];
      const foundUser = users.find(u => u.email === email);

      if (foundUser) {
        setUser(foundUser);
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);