import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, 
  ShoppingCart, 
  Menu, 
  X, 
  User, 
  LogOut,
  MessageCircle,
  Store,
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isSeller } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Beranda', icon: Home },
    { path: '/marketplace', label: 'Marketplace', icon: Store },
    { path: '/threads', label: 'Threads', icon: MessageCircle },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-coplace-bg/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Coffee className="text-coplace-orange" size={28} />
            <span className="text-xl font-bold text-gradient">COPLACE</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                  isActive(link.path)
                    ? 'bg-coplace-orange/20 text-coplace-orange'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}

            {isSeller && (
              <Link
                to="/seller"
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                  isActive('/seller')
                    ? 'bg-coplace-lime/20 text-coplace-lime'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Store size={18} />
                Dashboard
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/cart" className="relative p-2 hover:bg-white/5 rounded-xl transition-colors">
                  <ShoppingCart size={22} className="text-white/70" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-coplace-orange text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Link>
                <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                  <span className="text-sm text-white/70">{user.displayName || 'User'}</span>
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/70 hover:text-red-400"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 btn-primary py-2 px-4"
              >
                <User size={18} />
                Login dulu ngab
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-white/5 rounded-xl transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-coplace-bg/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive(link.path)
                      ? 'bg-coplace-orange/20 text-coplace-orange'
                      : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  <link.icon size={20} />
                  {link.label}
                </Link>
              ))}

              {isSeller && (
                <Link
                  to="/seller"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive('/seller')
                      ? 'bg-coplace-lime/20 text-coplace-lime'
                      : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  <Store size={20} />
                  Dashboard Penjual
                </Link>
              )}

              {user ? (
                <>
                  <Link
                    to="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5"
                  >
                    <ShoppingCart size={20} />
                    Keranjang
                    {cartCount > 0 && (
                      <span className="ml-auto bg-coplace-orange text-white text-xs px-2 py-1 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 w-full"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-coplace-orange text-white"
                >
                  <User size={20} />
                  Login dulu ngab
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
