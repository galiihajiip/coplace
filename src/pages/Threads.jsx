import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { MessageCircle, TrendingUp, Users, Send } from 'lucide-react';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import ThreadCard from '../components/threads/ThreadCard';
import Button from '../components/ui/Button';

const trendingHashtags = [
  { tag: '#InfoMaag', count: 234 },
  { tag: '#PagiProduktif', count: 189 },
  { tag: '#ArabicaVsRobusta', count: 156 },
  { tag: '#KopiLokal', count: 142 },
  { tag: '#BrewingTips', count: 98 }
];

const HASHTAGS = ['#InfoMaag', '#PagiProduktif', '#ArabicaVsRobusta'];

function Composer({ replyTo, onCancelReply }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim() || !user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'threads'), {
        content: content.trim(),
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        createdAt: serverTimestamp(),
        likes: [],
        replyTo: replyTo?.id || null,
        replyCount: 0
      });
      setContent('');
      if (onCancelReply) onCancelReply();
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return <div className="glass-card p-4 text-center text-white/60">Login dulu ngab buat posting</div>;
  }

  return (
    <div className="glass-card p-4">
      {replyTo && (
        <div className="mb-3 p-3 bg-white/5 rounded-xl flex justify-between">
          <span className="text-sm text-white/60">Membalas @{replyTo.authorName}</span>
          <button onClick={onCancelReply} className="text-white/40 text-sm">Batal</button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coplace-orange to-coplace-lime flex items-center justify-center text-white font-bold">
            {user.displayName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Spill rasa kopinya..."
              className="w-full bg-transparent resize-none text-white placeholder-white/40 focus:outline-none min-h-[80px]"
              maxLength={280}
            />
            <div className="flex flex-wrap gap-2 mb-3">
              {HASHTAGS.map((tag) => (
                <button key={tag} type="button" onClick={() => setContent(c => c + ' ' + tag)}
                  className="text-xs px-2 py-1 bg-white/5 text-coplace-lime rounded-full">
                  {tag}
                </button>
              ))}
            </div>
            <div className="flex justify-between border-t border-white/10 pt-3">
              <span className="text-sm text-white/40">{content.length}/280</span>
              <Button type="submit" size="sm" loading={loading} disabled={!content.trim()}>
                <Send size={16} className="mr-2" />Post
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function Threads() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(Math.floor(Math.random() * 50) + 20);

  useEffect(() => {
    const q = query(
      collection(db, 'threads'),
      where('replyTo', '==', null),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const threadsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setThreads(threadsData);
      setLoading(false);
    });

    const interval = setInterval(() => {
      setOnlineUsers(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 10000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleReply = (thread) => {
    setReplyTo(thread);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-bold mb-2">Threads Kopi</h1>
              <p className="text-white/60">Spill pengalaman ngopi kamu di sini</p>
            </motion.div>

            <Composer replyTo={replyTo} onCancelReply={() => setReplyTo(null)} />

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-coplace-orange"></div>
              </div>
            ) : threads.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 glass-card">
                <MessageCircle className="mx-auto text-white/20 mb-4" size={48} />
                <h3 className="text-lg font-semibold mb-2">Belum ada thread</h3>
                <p className="text-white/60">Jadi yang pertama posting!</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {threads.map((thread, index) => (
                  <motion.div key={thread.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <ThreadCard thread={thread} onReply={handleReply} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="text-coplace-lime" size={18} />
                <span className="font-semibold">Online Sekarang</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-2xl font-bold text-coplace-lime">{onlineUsers}</span>
                <span className="text-white/60 text-sm">pengguna aktif</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-coplace-orange" size={18} />
                <span className="font-semibold">Trending Hashtags</span>
              </div>
              <div className="space-y-3">
                {trendingHashtags.map((item, index) => (
                  <div key={item.tag} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-xl cursor-pointer">
                    <div>
                      <span className="text-white/40 text-sm mr-2">{index + 1}</span>
                      <span className="text-coplace-lime font-medium">{item.tag}</span>
                    </div>
                    <span className="text-white/40 text-sm">{item.count} posts</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Threads;