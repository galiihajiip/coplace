import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/dateUtils';
import Button from '../components/ui/Button';

function CartItem({ item, onUpdate, onRemove }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 flex gap-4">
      <img src={item.imageUrl || 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=200'} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-white/60 text-sm">{item.origin}</p>
        <p className="text-coplace-orange font-bold mt-1">{formatPrice(item.price)}</p>
      </div>
      <div className="flex flex-col items-end justify-between">
        <button onClick={() => onRemove(item.id)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
        <div className="flex items-center gap-2">
          <button onClick={() => onUpdate(item.id, item.quantity - 1)} className="p-1 bg-white/5 rounded-lg hover:bg-white/10"><Minus size={16} /></button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button onClick={() => onUpdate(item.id, item.quantity + 1)} className="p-1 bg-white/5 rounded-lg hover:bg-white/10"><Plus size={16} /></button>
        </div>
      </div>
    </motion.div>
  );
}

function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  async function handleCheckout() {
    setCheckingOut(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await clearCart();
    setCheckingOut(false);
    navigate('/marketplace');
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-2xl mx-auto text-center py-20">
          <ShoppingCart className="mx-auto text-white/20 mb-4" size={64} />
          <h2 className="text-2xl font-bold mb-2">Keranjang Kosong</h2>
          <p className="text-white/60 mb-6">Belum ada kopi di keranjangmu</p>
          <Button onClick={() => navigate('/marketplace')}>Jelajahi Marketplace</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/60 hover:text-white mb-6">
          <ArrowLeft size={20} />Kembali
        </button>
        <h1 className="text-3xl font-bold mb-8">Keranjang Belanja</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (<CartItem key={item.id} item={item} onUpdate={updateQuantity} onRemove={removeFromCart} />))}
          </div>
          <div className="glass-card p-6 h-fit">
            <h3 className="font-semibold mb-4">Ringkasan</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-white/60"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
              <div className="flex justify-between text-white/60"><span>Ongkir</span><span>Gratis</span></div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-lg"><span>Total</span><span className="text-coplace-orange">{formatPrice(cartTotal)}</span></div>
            </div>
            <Button onClick={handleCheckout} loading={checkingOut} className="w-full">Checkout Sekarang</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
