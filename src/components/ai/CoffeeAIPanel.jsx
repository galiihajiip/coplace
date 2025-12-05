import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, AlertTriangle, Coffee, Utensils, Lightbulb, X } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { generateCoffeeStory } from '../../lib/gemini';

const CoffeeAIPanel = ({ product }) => {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await generateCoffeeStory(product);
      setAiData(result);
      setIsOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <Button
        onClick={handleAnalyze}
        loading={loading}
        className="w-full flex items-center justify-center gap-2"
        variant="secondary"
      >
        <Sparkles size={20} />
        ✨ Cek Fakta Medis & Story Kopi
      </Button>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-400"
        >
          {error}
        </motion.div>
      )}

      <AnimatePresence>
        {isOpen && aiData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 glass-card p-6 space-y-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="text-coplace-lime" size={20} />
                AI Barista Analysis
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-coplace-orange/10 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Coffee className="text-coplace-orange" size={18} />
                  <span className="font-semibold text-coplace-orange">Story</span>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">{aiData.story}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 rounded-xl">
                  <span className="text-xs text-white/50">Flavor Profile</span>
                  <p className="text-sm font-medium mt-1">{aiData.flavor_profile}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <span className="text-xs text-white/50">Acidity Level</span>
                  <p className="text-sm font-medium mt-1">{aiData.acidity_level}</p>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="text-red-400" size={18} />
                  <span className="font-semibold">Info Kesehatan</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={aiData.health_safety?.is_safe_for_gerd ? 'success' : 'danger'}>
                      {aiData.health_safety?.is_safe_for_gerd ? 'Aman untuk GERD' : 'Tidak Aman untuk GERD'}
                    </Badge>
                  </div>
                  
                  {aiData.health_safety?.warning && (
                    <div className="flex items-start gap-2 text-yellow-400 text-sm">
                      <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                      <span>{aiData.health_safety.warning}</span>
                    </div>
                  )}
                  
                  <p className="text-sm text-white/60">
                    <span className="text-white/40">Rekomendasi Usia:</span> {aiData.health_safety?.age_recommendation}
                  </p>
                  
                  {aiData.health_safety?.conditions_to_avoid?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {aiData.health_safety.conditions_to_avoid.map((condition, idx) => (
                        <Badge key={idx} variant="warning">{condition}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-coplace-lime/10 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Utensils className="text-coplace-lime" size={18} />
                  <span className="font-semibold text-coplace-lime">Pairing Makanan</span>
                </div>
                <p className="text-white/80 text-sm">{aiData.pairing_food}</p>
              </div>

              <div className="p-4 bg-purple-500/10 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-purple-400" size={18} />
                  <span className="font-semibold text-purple-400">Fun Fact</span>
                </div>
                <p className="text-white/80 text-sm">{aiData.fun_fact}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoffeeAIPanel;
