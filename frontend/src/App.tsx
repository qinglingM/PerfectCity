import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Play, KeyRound, Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import SharedResultPage from './pages/SharedResultPage';
import ActivatePage from './pages/ActivatePage';
import type { UserAnswers } from './core/match';

// Shell wrapper: phone-frame styling
function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#FDFCDC] text-[#4A4A4A] flex justify-center items-center overflow-hidden font-sans">
      <div className="w-full max-w-md min-h-screen sm:min-h-[800px] sm:h-[800px] sm:rounded-[40px] shadow-2xl relative overflow-hidden bg-white sm:border-8 border-white">
        {children}
      </div>
    </div>
  );
}

// Protected route: requires activated code
function ProtectedQuizRoute() {
  const { hasAccess, loading } = useAuth();
  const navigate = useNavigate();
  const [appState, setAppState] = useState<'QUIZ' | 'LOADING' | 'RESULT'>('QUIZ');
  const [answers, setAnswers] = useState<UserAnswers>({});

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#FDFCDC]">
        <motion.div
          animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-cute"
        >
          <MapPin className="w-10 h-10 text-[#84DCC6] fill-current" />
        </motion.div>
      </div>
    );
  }

  // No access → go to activate page
  if (!hasAccess) {
    navigate('/activate', { replace: true });
    return null;
  }

  const handleQuizComplete = (finalAnswers: UserAnswers) => {
    setAnswers(finalAnswers);
    setAppState('LOADING');
    setTimeout(() => {
      setAppState('RESULT');
    }, 1500);
  };

  return (
    <AnimatePresence mode="wait">
      {appState === 'QUIZ' && (
        <QuizPage
          key="quiz"
          onComplete={handleQuizComplete}
          onExit={() => navigate('/')}
        />
      )}

      {appState === 'LOADING' && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[#FDFCDC]"
        >
          <motion.div
            animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-cute mb-6"
          >
            <MapPin className="w-12 h-12 text-[#84DCC6] fill-current" />
          </motion.div>
          <h2 className="text-2xl font-bold text-[#4A4A4A] animate-pulse">
            正在匹配城市...
          </h2>
        </motion.div>
      )}

      {appState === 'RESULT' && (
        <ResultPage key="result" answers={answers} />
      )}
    </AnimatePresence>
  );
}

// Landing / Start page
function StartPage() {
  const navigate = useNavigate();
  const { hasAccess, activate } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [activating, setActivating] = useState(false);

  const XIAOHONGSHU_LINK = import.meta.env.VITE_XIAOHONGSHU_LINK || '#';

  const handleActivate = async () => {
    if (!code.trim()) return;
    setActivating(true);
    setError('');
    const result = await activate(code);
    if (result.success) {
      navigate('/quiz');
    } else {
      setError(result.error || '激活失败');
    }
    setActivating(false);
  };

  return (
    <motion.div
      key="start"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#FFF2ED] to-[#FFCAD4]"
    >
      <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-cute mb-8 relative">
        <MapPin className="w-16 h-16 text-[#FFB5A7]" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -top-2 -right-2 text-[#84DCC6]"
        >
          <Sparkles size={32} fill="currentColor" />
        </motion.div>
      </div>

      <h1 className="text-4xl font-black mb-4 text-center tracking-tight text-[#fc816b]">
        寻找你的<br />本命城市
      </h1>
      <p className="text-center text-[#9B9B9B] mb-8 font-medium">
        20道简单选择题<br />测测哪个城市最懂你
      </p>

      {hasAccess ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95, y: 4 }}
          onClick={() => navigate('/quiz')}
          className="w-full py-4 bg-[#FFB5A7] text-white rounded-3xl font-bold text-lg shadow-cute flex items-center justify-center gap-2"
        >
          <Play fill="currentColor" size={20} />
          立即开始测试
        </motion.button>
      ) : (
        <div className="w-full flex flex-col gap-3">
          <div className="w-full bg-white rounded-[24px] p-4 shadow-xl">
            <div className="flex items-center gap-2 bg-[#FDFCDC] p-3 rounded-2xl mb-3">
              <KeyRound size={18} className="text-[#9B9B9B] flex-shrink-0" />
              <input
                type="text"
                placeholder="输入激活码"
                value={code}
                onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleActivate()}
                className="flex-1 bg-transparent outline-none text-base text-[#4A4A4A] placeholder-[#C0C0C0] tracking-wider font-mono"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleActivate}
              disabled={!code.trim() || activating}
              className="w-full py-3 bg-[#FFB5A7] text-white rounded-2xl font-bold text-base shadow-cute disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
            >
              {activating ? <Loader2 size={18} className="animate-spin" /> : <Play fill="currentColor" size={16} />}
              {activating ? '激活中...' : '激活'}
            </motion.button>
            {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
          </div>

          <a
            href={XIAOHONGSHU_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-[#9B9B9B] text-sm underline"
          >
            还没有激活码？去购买
          </a>
        </div>
      )}
    </motion.div>
  );
}


function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/activate" element={<ActivatePage />} />
        <Route path="/quiz" element={<ProtectedQuizRoute />} />
        <Route path="/share/:shareId" element={<SharedResultPage />} />
      </Routes>
    </AppShell>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
