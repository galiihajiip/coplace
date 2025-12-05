import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coffee, Sparkles, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const Home = () => {
  const features = [
    {
      icon: ShoppingBag,
      title: 'Marketplace Kopi Lokal',
      description: 'Temukan kopi terbaik langsung dari petani Indonesia',
      color: 'text-coplace-orange',
      bg: 'bg-coplace-orange/20'
    },
    {
      icon: Sparkles,
      title: 'AI Barista',
      description: 'Analisis kesehatan & storytelling kopi dengan AI',
      color: 'text-coplace-lime',
      bg: 'bg-coplace-lime/20'
    },
    {
      icon: MessageCircle,
      title: 'Realtime Threads',
      description: 'Diskusi & share pengalaman ngopi bareng komunitas',
      color: 'text-purple-400',
      bg: 'bg-purple-400/20'
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-coplace-orange/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-coplace-orange/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-coplace-lime/20 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-6">
              <Coffee className="text-coplace-orange" size={18} />
              <span className="text-sm text-white/70">Marketplace Kopi Lokal Indonesia</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Temukan Kopi Terbaik
              <br />
              <span className="text-gradient">dari Petani Lokal</span>
            </h1>
            
            <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
              COPLACE menghubungkan kamu langsung dengan petani kopi Indonesia. 
              Dilengkapi AI Barista untuk analisis kesehatan & storytelling kopi.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/marketplace">
                <Button size="lg" className="w-full sm:w-auto">
                  Jelajahi Marketplace
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
              <Link to="/threads">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  Gabung Komunitas
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Kenapa COPLACE?</h2>
            <p className="text-white/60">Fitur-fitur keren yang bikin ngopi makin seru</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className={feature.color} size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-coplace-orange/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-8 md:p-12"
          >
            <Sparkles className="text-coplace-lime mx-auto mb-4" size={40} />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Cek Khodam Kopi Kamu
            </h2>
            <p className="text-white/60 mb-6">
              AI Barista kami bisa analisis fakta medis, storytelling, 
              dan rekomendasi pairing makanan untuk setiap kopi!
            </p>
            <Link to="/marketplace">
              <Button variant="secondary">
                Coba Sekarang
                <Sparkles size={18} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
