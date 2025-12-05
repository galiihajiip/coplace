import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Search, Filter, Coffee, MapPin } from 'lucide-react';
import { db } from '../lib/firebase';
import ProductCard from '../components/product/ProductCard';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const origins = [
  'Semua',
  'Aceh Gayo',
  'Toraja',
  'Bali Kintamani',
  'Flores Bajawa',
  'Jawa Barat',
  'Papua Wamena',
  'Lampung',
  'Bengkulu'
];

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('Semua');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
      setFilteredProducts(productsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let result = products;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.origin?.toLowerCase().includes(query)
      );
    }

    if (selectedOrigin !== 'Semua') {
      result = result.filter(p => p.origin === selectedOrigin);
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedOrigin, products]);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Marketplace Kopi</h1>
          <p className="text-white/60">Temukan kopi lokal terbaik dari seluruh Indonesia</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <Input
              type="text"
              placeholder="Cari kopi favoritmu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl"
          >
            <Filter size={18} />
            Filter
          </button>
        </div>

        <div className={`mb-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-white/40" />
            <span className="text-sm text-white/60">Filter by Origin:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {origins.map((origin) => (
              <button
                key={origin}
                onClick={() => setSelectedOrigin(origin)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedOrigin === origin
                    ? 'bg-coplace-orange text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {origin}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coplace-orange"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Coffee className="mx-auto text-white/20 mb-4" size={64} />
            <h3 className="text-xl font-semibold mb-2">Belum ada kopi</h3>
            <p className="text-white/60">
              {searchQuery || selectedOrigin !== 'Semua'
                ? 'Coba ubah filter pencarian'
                : 'Kopi akan segera tersedia'}
            </p>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="lime">{filteredProducts.length} produk ditemukan</Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
