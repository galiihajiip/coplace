import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Flame, ShoppingCart, Minus, Plus } from 'lucide-react';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/dateUtils';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import CoffeeAIPanel from '../components/ai/CoffeeAIPanel';
import ProductCard from '../components/product/ProductCard';

const roastLabels = {
  light: { label: 'Light Roast', color: 'bg-amber-400' },
  medium: { label: 'Medium Roast', color: 'bg-amber-600' },
  dark: { label: 'Dark Roast', color: 'bg-amber-900' }
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() };
          setProduct(productData);
          
          const relatedQuery = query(
            collection(db, 'products'),
            where('origin', '==', productData.origin)
          );
          const relatedSnap = await getDocs(relatedQuery);
          const related = relatedSnap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(p => p.id !== id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (user && product) {
      addToCart(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coplace-orange"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h2>
          <Button onClick={() => navigate('/marketplace')}>Kembali ke Marketplace</Button>
        </div>
      </div>
    );
  }

  const roast = roastLabels[product.roastLevel] || roastLabels.medium;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Kembali
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card overflow-hidden"
          >
            <img
              src={product.imageUrl || 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800'}
              alt={product.name}
              className="w-full h-[400px] object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="orange">
                  <MapPin size={12} className="mr-1" />
                  {product.origin}
                </Badge>
                <Badge variant="default">
                  <div className={`w-2 h-2 rounded-full ${roast.color} mr-2`} />
                  {roast.label}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-white/60 leading-relaxed">{product.description}</p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60">Harga</span>
                <span className="text-3xl font-bold text-coplace-orange">
                  {formatPrice(product.price)}
                </span>
              </div>

              {user ? (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-white/60">Jumlah:</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="w-12 text-center font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>

                  <Button onClick={handleAddToCart} className="w-full">
                    <ShoppingCart size={20} className="mr-2" />
                    Tambah ke Keranjang
                  </Button>
                </>
              ) : (
                <Button onClick={() => navigate('/login')} className="w-full">
                  Login untuk Membeli
                </Button>
              )}
            </div>

            <CoffeeAIPanel product={product} />
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold mb-6">Kopi Serupa dari {product.origin}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
