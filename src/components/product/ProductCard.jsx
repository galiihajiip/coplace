import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Flame, ShoppingCart } from 'lucide-react';
import Badge from '../ui/Badge';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const roastColors = {
  light: 'bg-amber-400',
  medium: 'bg-amber-600',
  dark: 'bg-amber-900'
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      addToCart(product);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.2 }}
        className="glass-card overflow-hidden group cursor-pointer h-full flex flex-col"
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="orange">
              <MapPin size={12} className="mr-1" />
              {product.origin}
            </Badge>
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <div className={`w-3 h-3 rounded-full ${roastColors[product.roastLevel] || roastColors.medium}`} />
            <span className="text-xs text-white bg-black/50 px-2 py-1 rounded-full capitalize">
              {product.roastLevel}
            </span>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-1 group-hover:text-coplace-orange transition-colors">
            {product.name}
          </h3>
          <p className="text-white/60 text-sm mb-3 line-clamp-2 flex-1">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="text-coplace-orange font-bold text-lg">
              {formatPrice(product.price)}
            </span>
            {user && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="p-2 bg-coplace-orange/20 hover:bg-coplace-orange text-coplace-orange hover:text-white rounded-xl transition-colors"
              >
                <ShoppingCart size={18} />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
