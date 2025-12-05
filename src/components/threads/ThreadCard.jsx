import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from '../../utils/dateUtils';

const ThreadCard = ({ thread, onReply }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(thread.likes?.includes(user?.uid));
  const [likeCount, setLikeCount] = useState(thread.likes?.length || 0);

  const handleLike = async () => {
    if (!user) return;

    const threadRef = doc(db, 'threads', thread.id);
    
    if (isLiked) {
      await updateDoc(threadRef, {
        likes: arrayRemove(user.uid)
      });
      setLikeCount(prev => prev - 1);
    } else {
      await updateDoc(threadRef, {
        likes: arrayUnion(user.uid)
      });
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const renderContent = (text) => {
    const parts = text.split(/(@\w+|#\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span key={index} className="text-coplace-orange hover:underline cursor-pointer">
            {part}
          </span>
        );
      }
      if (part.startsWith('#')) {
        return (
          <span key={index} className="text-coplace-lime hover:underline cursor-pointer">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4"
    >
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coplace-orange to-coplace-lime flex items-center justify-center text-white font-bold flex-shrink-0">
          {thread.authorName?.charAt(0).toUpperCase() || 'U'}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold truncate">{thread.authorName || 'Anonymous'}</span>
            <span className="text-white/40 text-sm">
              · {formatDistanceToNow(thread.createdAt)}
            </span>
          </div>
          
          <p className="text-white/90 whitespace-pre-wrap break-words mb-3">
            {renderContent(thread.content)}
          </p>

          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors ${
                isLiked ? 'text-red-500' : 'text-white/50 hover:text-red-500'
              }`}
            >
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
              <span className="text-sm">{likeCount}</span>
            </button>

            <button
              onClick={() => onReply(thread)}
              className="flex items-center gap-2 text-white/50 hover:text-coplace-orange transition-colors"
            >
              <MessageCircle size={18} />
              <span className="text-sm">{thread.replyCount || 0}</span>
            </button>

            <button className="flex items-center gap-2 text-white/50 hover:text-coplace-lime transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ThreadCard;
