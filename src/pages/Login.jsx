import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coffee, Mail, Lock, User, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('buyer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(email, password, displayName, role);
      } else {
        await login(email, password);
      }
      navigate('/marketplace');
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Coffee className="text-coplace-orange" size={32} />
            <span className="text-2xl font-bold text-gradient">COPLACE</span>
          </Link>
          <h1 className="text-2xl font-bold">
            {isRegister ? 'Daftar Akun Baru' : 'Login dulu ngab'}
          </h1>
          <p className="text-white/60 mt-2">
            {isRegister ? 'Gabung komunitas kopi Indonesia' : 'Masuk ke akunmu'}
          </p>
        </div>

        <div className="glass-card p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <Input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="pl-12"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`p-4 rounded-2xl border transition-all ${
                      role === 'buyer'
                        ? 'border-coplace-orange bg-coplace-orange/20 text-coplace-orange'
                        : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <User className="mx-auto mb-2" size={24} />
                    <span className="text-sm font-medium">Pembeli</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('seller')}
                    className={`p-4 rounded-2xl border transition-all ${
                      role === 'seller'
                        ? 'border-coplace-lime bg-coplace-lime/20 text-coplace-lime'
                        : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <Store className="mx-auto mb-2" size={24} />
                    <span className="text-sm font-medium">Penjual</span>
                  </button>
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12"
                required
              />
            </div>

            <Button type="submit" loading={loading} className="w-full">
              {isRegister ? 'Daftar Sekarang' : 'Masuk'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-sm text-white/60 hover:text-coplace-orange transition-colors"
            >
              {isRegister ? 'Sudah punya akun? Login' : 'Belum punya akun? Daftar'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
