import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Package, TrendingUp } from 'lucide-react';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/dateUtils';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ProductForm from '../components/product/ProductForm';
import Badge from '../components/ui/Badge';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'products'),
      where('createdBy', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddProduct = async (data) => {
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'products'), {
        ...data,
        createdBy: user.uid,
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = async (data) => {
    setSubmitting(true);
    try {
      await updateDoc(doc(db, 'products', editingProduct.id), data);
      setEditingProduct(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Yakin mau hapus produk ini?')) return;
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard Penjual</h1>
            <p className="text-white/60">Kelola produk kopi kamu di sini</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Tambah Produk Baru
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard icon={Package} label="Total Produk" value={products.length} color="orange" />
          <StatCard icon={TrendingUp} label="Total Nilai" value={formatPrice(totalValue)} color="lime" />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-coplace-orange" />
          </div>
        ) : products.length === 0 ? (
          <EmptyState onAdd={() => setIsModalOpen(true)} />
        ) : (
          <ProductTable
            products={products}
            onEdit={openEditModal}
            onDelete={handleDeleteProduct}
          />
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
        >
          <ProductForm
            initialData={editingProduct}
            onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
            onCancel={closeModal}
            loading={submitting}
          />
        </Modal>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-4"
  >
    <div className="flex items-center gap-3">
      <div className={`p-3 rounded-xl ${color === 'orange' ? 'bg-coplace-orange/20' : 'bg-coplace-lime/20'}`}>
        <Icon className={color === 'orange' ? 'text-coplace-orange' : 'text-coplace-lime'} size={24} />
      </div>
      <div>
        <p className="text-white/60 text-sm">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  </motion.div>
);

const EmptyState = ({ onAdd }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-16 glass-card"
  >
    <Package className="mx-auto text-white/20 mb-4" size={64} />
    <h3 className="text-xl font-semibold mb-2">Belum ada produk</h3>
    <p className="text-white/60 mb-6">Mulai jual kopi kamu sekarang!</p>
    <Button onClick={onAdd}>
      <Plus size={20} className="mr-2" />
      Tambah Produk Pertama
    </Button>
  </motion.div>
);

const ProductTable = ({ products, onEdit, onDelete }) => (
  <div className="glass-card overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-white/5">
          <tr>
            <th className="text-left p-4 text-white/60 font-medium">Produk</th>
            <th className="text-left p-4 text-white/60 font-medium">Origin</th>
            <th className="text-left p-4 text-white/60 font-medium">Roast</th>
            <th className="text-left p-4 text-white/60 font-medium">Harga</th>
            <th className="text-right p-4 text-white/60 font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t border-white/5 hover:bg-white/5">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=100'}
                    alt={product.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <span className="font-medium">{product.name}</span>
                </div>
              </td>
              <td className="p-4">
                <Badge variant="orange">{product.origin}</Badge>
              </td>
              <td className="p-4 capitalize">{product.roastLevel}</td>
              <td className="p-4 text-coplace-orange font-semibold">{formatPrice(product.price)}</td>
              <td className="p-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="p-2 hover:bg-white/10 rounded-xl text-white/60 hover:text-coplace-orange"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="p-2 hover:bg-red-500/10 rounded-xl text-white/60 hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default SellerDashboard;
