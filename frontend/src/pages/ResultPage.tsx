import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { UserAnswers, MatchResult } from '../core/match';
import { calculateMatch } from '../core/match';
import { MapPin, RotateCcw } from 'lucide-react';

interface ResultPageProps {
    answers: UserAnswers;
}

export default function ResultPage({ answers }: ResultPageProps) {
    const navigate = useNavigate();
    const [results, setResults] = useState<MatchResult[]>([]);


    useEffect(() => {
        const timer = setTimeout(() => {
            setResults(calculateMatch(answers));
        }, 800);
        return () => clearTimeout(timer);
    }, [answers]);



    const handleRestart = () => {
        navigate('/quiz', { replace: true });
        // Force page reload to reset quiz state
        window.location.reload();
    };

    if (results.length === 0) return null;

    const mainResult = results[0];
    const otherResults = results.slice(1, 4);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-gradient-to-b from-[#FFF2ED] to-[#FFCAD4] flex flex-col items-center p-8 overflow-y-auto"
        >
            <div className="w-full flex justify-center items-center mb-6 relative">
                <div className="font-bold text-[#FFB5A7] py-2 px-4 bg-white rounded-full shadow-cute text-sm">
                    你的专属报告
                </div>
            </div>

            <div className="w-full bg-white rounded-[32px] p-8 shadow-2xl relative mt-4">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FFB5A7] text-white px-6 py-2 rounded-full font-black text-lg border-4 border-white shadow-cute">
                    匹配度 {mainResult.matchPercent}%
                </div>

                <div className="flex flex-col items-center mt-6">
                    <div className="w-24 h-24 bg-[#FDFCDC] rounded-full flex items-center justify-center mb-4">
                        <MapPin size={48} className="text-[#84DCC6]" fill="currentColor" />
                    </div>

                    <h1 className="text-5xl font-black text-[#4A4A4A] mb-2 tracking-widest">
                        {mainResult.city.name}
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

            {/* Other Matches */}
            <div className="w-full mt-8 flex flex-col gap-4">
                <h3 className="text-[#4A4A4A] font-bold text-lg px-2 text-center mb-2">其他高匹配度城市</h3>
                {otherResults.map((res, index) => (
                    <div key={res.city.name} className="bg-white/80 backdrop-blur rounded-[24px] p-5 shadow-cute border-2 border-white flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-[#FFB5A7] text-white px-3 py-1 rounded-bl-xl font-bold text-sm">
                            TOP {index + 2}
                        </div>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-[#FFCAD4]/30 rounded-full flex items-center justify-center">
                                    <MapPin size={20} className="text-[#fc816b]" />
                                </div>
                                <h3 className="text-2xl font-black text-[#4A4A4A]">{res.city.name}</h3>
                            </div>
                            <div className="text-xl font-black text-[#84DCC6]">{res.matchPercent}%</div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className="bg-[#FDFCDC] text-[#B5B246] px-3 py-1 rounded-full text-xs font-bold">
                                #生活方式相近
                            </span>
                            <span className="bg-[#FDFCDC] text-[#B5B246] px-3 py-1 rounded-full text-xs font-bold">
                                #值得考虑
                            </span>
                        </div>
                        <p className="text-sm text-[#9B9B9B] leading-relaxed">
                            {res.city.name} 也很适合你，它的节奏和你的期待高度重合，也是一个非常不错的备选地。
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 w-full">
                <button
                    onClick={handleRestart}
                    className="w-full py-4 bg-white text-[#fc816b] border-2 border-[#FFCAD4] rounded-[24px] font-bold text-lg shadow-cute flex justify-center items-center gap-2"
                >
                    <RotateCcw size={20} />
                    <span>重新测试</span>
                </button>
            </div>
        </motion.div>
    );
}
