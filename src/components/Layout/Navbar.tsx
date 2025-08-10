import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Recycle, User, LogOut, Plus, Search } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Recycle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">T2C</span>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/feed"
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Explorar</span>
              </Link>
              
              {user?.role === 'GEN' && (
                <Link
                  to="/publish"
                  className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publicar Lote</span>
                </Link>
              )}
              
              <Link
                to="/matches"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Mis Operaciones
              </Link>
              
              <Link
                to="/esg"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Impacto ESG
              </Link>
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block">{user?.companyName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:block">Salir</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/auth"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/auth?mode=register"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};