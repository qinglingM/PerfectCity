import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { QUESTIONS_20 } from '../config/questions20';
import type { UserAnswers } from '../core/match';

interface QuizPageProps {
    onComplete: (answers: UserAnswers) => void;
    onExit: () => void;
}

export default function QuizPage({ onComplete, onExit }: QuizPageProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<UserAnswers>({});

    const question = QUESTIONS_20[currentIndex];
    const progress = ((currentIndex + 1) / QUESTIONS_20.length) * 100;

    const handleSelect = (option: 'A' | 'B' | 'C') => {
        const newAnswers = { ...answers, [question.id]: option };
        setAnswers(newAnswers);

        if (currentIndex < QUESTIONS_20.length - 1) {
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
            }, 300); // short delay for animation
        } else {
            setTimeout(() => {
                onComplete(newAnswers);
            }, 300);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        } else {
            if (window.confirm('确定要退出测试吗？之前的进度将丢失。')) {
                onExit();
            }
        }
    };

    return (
        <div className="absolute inset-0 bg-[#FDFCDC] flex flex-col pt-8 sm:pt-12">

            {/* Header & Progress */}
            <div className="px-6 mb-8 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        className="p-2 -ml-2 text-[#9B9B9B] hover:text-[#4A4A4A] transition-colors rounded-full hover:bg-black/5"
                    >
                        <ChevronLeft size={28} />
                    </button>
                    <span className="font-bold text-[#FFB5A7]">
                        {currentIndex + 1} <span className="text-[#FFCAD4]">/ {QUESTIONS_20.length}</span>
                    </span>
                    <div className="w-10" /> {/* Spacer for centering */}
                </div>

                {/* Progress Bar */}
                <div className="h-3 w-full bg-[#FFCAD4]/30 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-[#FFB5A7] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Question Area */}
            <div className="flex-1 px-6 flex flex-col relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={question.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 flex flex-col mt-4"
                    >
                        <div className="min-h-[100px] flex items-center mb-8 bg-white p-6 rounded-[24px] shadow-cute border-2 border-[#FFCAD4]/30">
                            <h2 className="text-xl font-bold leading-relaxed text-[#4A4A4A]">
                                {question.q}
                            </h2>
                        </div>

                        <div className="flex flex-col gap-4">
                            {(['A', 'B', 'C'] as const).map((opt) => {
                                const isSelected = answers[question.id] === opt;
                                return (
                                    <motion.button
                                        key={opt}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleSelect(opt)}
                                        className={`
                      w-full p-5 rounded-[20px] text-left font-medium text-lg transition-all duration-200
                      ${isSelected
                                                ? 'bg-[#FFB5A7] text-white shadow-cute-active border-transparent'
                                                : 'bg-white text-[#4A4A4A] shadow-cute hover:border-[#FFB5A7] border-2 border-transparent'
                                            }
                    `}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                        ${isSelected ? 'bg-white/20 text-white' : 'bg-[#FDFCDC] text-[#9B9B9B]'}
                      `}>
                                                {opt}
                                            </div>
                                            <span>{question[opt]}</span>
                                        </div>
                                    </motion.button>
                                )
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

        </div>
    );
}
