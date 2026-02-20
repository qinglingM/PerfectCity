import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { UserAnswers, MatchResult } from '../core/match';
import { calculateMatch } from '../core/match';
import { MapPin, Share2, RotateCcw } from 'lucide-react';

interface ResultPageProps {
    answers: UserAnswers;
    onRestart: () => void;
}

export default function ResultPage({ answers, onRestart }: ResultPageProps) {
    const [result, setResult] = useState<MatchResult | null>(null);

    useEffect(() => {
        // Small delay to make the matching process feel "calculated"
        const timer = setTimeout(() => {
            setResult(calculateMatch(answers));
        }, 800);
        return () => clearTimeout(timer);
    }, [answers]);

    if (!result) return null; // App.tsx is showing LOADING state overlay usually, but this is fallback

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-gradient-to-b from-[#FFF2ED] to-[#FFCAD4] flex flex-col items-center p-8 overflow-y-auto"
        >
            <div className="w-full flex justify-between items-center mb-6">
                <button
                    onClick={onRestart}
                    className="p-3 bg-white/50 backdrop-blur rounded-full text-[#4A4A4A] shadow-cute"
                >
                    <RotateCcw size={20} />
                </button>
                <div className="font-bold text-[#FFB5A7] py-2 px-4 bg-white rounded-full shadow-cute text-sm">
                    你的专属报告
                </div>
                <div className="w-11" /> {/* Spacer */}
            </div>

            <div className="w-full bg-white rounded-[32px] p-8 shadow-2xl relative mt-4">
                {/* Floating badge */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FFB5A7] text-white px-6 py-2 rounded-full font-black text-lg border-4 border-white shadow-cute">
                    MATCH {result.matchPercent}%
                </div>

                <div className="flex flex-col items-center mt-6">
                    <div className="w-24 h-24 bg-[#FDFCDC] rounded-full flex items-center justify-center mb-4">
                        <MapPin size={48} className="text-[#84DCC6]" fill="currentColor" />
                    </div>

                    <h1 className="text-5xl font-black text-[#4A4A4A] mb-2 tracking-widest">
                        {result.city.name}
                    </h1>

                    <p className="text-[#9B9B9B] font-medium mb-8">
                        最懂你的本命之城
                    </p>

                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        <span className="bg-[#FFCAD4]/30 text-[#fc816b] px-4 py-1.5 rounded-full text-sm font-bold">
                            #契合度超高
                        </span>
                        <span className="bg-[#84DCC6]/20 text-[#2BB295] px-4 py-1.5 rounded-full text-sm font-bold">
                            #理想生活
                        </span>
                        <span className="bg-[#A0C4FF]/20 text-[#4D88FF] px-4 py-1.5 rounded-full text-sm font-bold">
                            #绝佳去处
                        </span>
                    </div>

                    <div className="bg-[#FDFCDC] p-5 rounded-2xl w-full relative">
                        <div className="absolute top-0 left-4 -translate-y-1/2 text-4xl text-[#FFB5A7] opacity-50 font-serif">"</div>
                        <p className="text-sm leading-relaxed text-[#4A4A4A] font-medium text-center z-10 relative">
                            在这座城市里，你能找到属于自己的节奏。无论是职场上的拼搏，还是周末随心的漫步，这里都能接纳你最真实的模样。准备好拥抱新的开始了么？
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex gap-4 w-full">
                <button className="flex-1 py-4 bg-[#84DCC6] text-white rounded-[24px] font-bold text-lg shadow-cute flex justify-center items-center gap-2">
                    <Share2 size={20} />
                    <span>分享结果</span>
                </button>
            </div>

        </motion.div>
    );
}
