import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Play } from 'lucide-react';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import type { UserAnswers } from './core/match';

export type AppState = 'START' | 'QUIZ' | 'LOADING' | 'RESULT';

function App() {
  const [appState, setAppState] = useState<AppState>('START');
  const [answers, setAnswers] = useState<UserAnswers>({});

  const handleQuizComplete = (finalAnswers: UserAnswers) => {
    setAnswers(finalAnswers);
    setAppState('LOADING');
    setTimeout(() => {
      setAppState('RESULT');
    }, 1500); // Wait 1.5s for the "Calculating" animation
  };

  const clearAndRestart = () => {
    setAnswers({});
    setAppState('START');
  };

  return (
    <div className="min-h-screen w-full bg-[#FDFCDC] text-[#4A4A4A] flex justify-center items-center overflow-hidden font-sans">
      <div className="w-full max-w-md min-h-screen sm:min-h-[800px] sm:h-[800px] sm:rounded-[40px] shadow-2xl relative overflow-hidden bg-white sm:border-8 border-white">

        <AnimatePresence mode="wait">
          {appState === 'START' && (
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
              <p className="text-center text-[#9B9B9B] mb-12 font-medium">
                20道简单选择题<br />测测哪个城市最懂你
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, y: 4 }}
                onClick={() => setAppState('QUIZ')}
                className="w-full py-4 bg-[#FFB5A7] text-white rounded-3xl font-bold text-lg shadow-cute flex items-center justify-center gap-2"
              >
                <Play fill="currentColor" size={20} />
                立即开始测试
              </motion.button>
            </motion.div>
          )}

          {appState === 'QUIZ' && (
            <QuizPage
              key="quiz"
              onComplete={handleQuizComplete}
              onExit={clearAndRestart}
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
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.1, 1]
                }}
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
            <ResultPage
              key="result"
              answers={answers}
              onRestart={clearAndRestart}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
