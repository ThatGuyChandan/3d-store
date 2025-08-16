import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import ProductGallery from './pages/ProductGallery';
import ProductViewer from './pages/ProductViewer';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading authentication...</div>; // Or a spinner
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const Navbar = () => {
  const { isAuthenticated, logout, username } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate(isAuthenticated ? '/my-products' : '/')}>3D Viewer</div>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <span className="welcome-message">Welcome, {username}!</span>
            <button onClick={handleLogout} className="navbar-button">Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')} className="navbar-button">Login</button>
            <button onClick={() => navigate('/register')} className="navbar-button">Register</button>
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading application...</div>; // Initial app loading
  }

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Public Homepage - Product Gallery without login */}
        <Route path="/" element={<ProductGallery isPublic={true} />} />

        {/* Protected Product Gallery */}
        <Route
          path="/my-products"
          element={
            <PrivateRoute>
              <ProductGallery isPublic={false} />
            </PrivateRoute>
          }
        />
        {/* Protected Product Viewer */}
        <Route
          path="/products/:id"
          element={
            <PrivateRoute>
              <ProductViewer />
            </PrivateRoute>
          }
        />

        {/* Redirect from root to /my-products if authenticated */}
        {isAuthenticated && <Route path="/" element={<Navigate to="/my-products" replace />} />}
      </Routes>
    </div>
  );
}

export default App;