import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { MapPin, Play } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SharedResult {
    city_name: string;
    match_percent: number;
    tags: string[];
    description: string;
}

const XIAOHONGSHU_LINK = import.meta.env.VITE_XIAOHONGSHU_LINK || '#';

export default function SharedResultPage() {
    const { shareId } = useParams<{ shareId: string }>();
    const [result, setResult] = useState<SharedResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!shareId) {
            setError('无效的分享链接');
            setLoading(false);
            return;
        }

        const fetchResult = async () => {
            try {
                const { data, error: fetchError } = await supabase
                    .from('shared_results')
                    .select('city_name, match_percent, tags, description')
                    .eq('share_id', shareId)
                    .single();

                if (fetchError || !data) {
                    setError('分享结果不存在或已失效');
                    return;
                }
                setResult(data);
            } catch {
                setError('加载失败，请重试');
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [shareId]);

    if (loading) {
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FDFCDC]">
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-cute mb-6"
                >
                    <MapPin className="w-10 h-10 text-[#84DCC6] fill-current" />
                </motion.div>
                <p className="text-[#9B9B9B] font-medium animate-pulse">加载中...</p>
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[#FDFCDC]">
                <div className="w-20 h-20 bg-[#FFCAD4] rounded-full flex items-center justify-center shadow-cute mb-6">
                    <MapPin className="w-10 h-10 text-white" />
                </div>
                <p className="text-[#4A4A4A] font-bold text-lg mb-8">{error}</p>
                <a
                    href={XIAOHONGSHU_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-[#FFB5A7] text-white rounded-[24px] font-bold text-lg shadow-cute flex justify-center items-center gap-2 text-center"
                >
                    <Play size={20} fill="currentColor" />
                    <span>我也测一下 </span>
                </a>
            </div>
        );
    }

    // Tag colors for visual variety
    const tagStyles = [
        { bg: 'bg-[#FFCAD4]/30', text: 'text-[#fc816b]' },
        { bg: 'bg-[#84DCC6]/20', text: 'text-[#2BB295]' },
        { bg: 'bg-[#A0C4FF]/20', text: 'text-[#4D88FF]' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-gradient-to-b from-[#FFF2ED] to-[#FFCAD4] flex flex-col items-center p-8 overflow-y-auto"
        >
            <div className="w-full flex justify-center items-center mb-6">
                <div className="font-bold text-[#FFB5A7] py-2 px-4 bg-white rounded-full shadow-cute text-sm">
                    好友的专属报告
                </div>
            </div>

            <div className="w-full bg-white rounded-[32px] p-8 shadow-2xl relative mt-4">
                {/* Floating badge */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FFB5A7] text-white px-6 py-2 rounded-full font-black text-lg border-4 border-white shadow-cute">
                    匹配度 {result.match_percent}%
                </div>

                <div className="flex flex-col items-center mt-6">
                    <div className="w-24 h-24 bg-[#FDFCDC] rounded-full flex items-center justify-center mb-4">
                        <MapPin size={48} className="text-[#84DCC6]" fill="currentColor" />
                    </div>

                    <h1 className="text-5xl font-black text-[#4A4A4A] mb-2 tracking-widest">
                        {result.city_name}
                    </h1>

                    <p className="text-[#9B9B9B] font-medium mb-8">
                        最懂TA的本命之城
                    </p>

                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {result.tags.map((tag, i) => {
                            const style = tagStyles[i % tagStyles.length];
                            return (
                                <span key={i} className={`${style.bg} ${style.text} px-4 py-1.5 rounded-full text-sm font-bold`}>
                                    #{tag}
                                </span>
                            );
                        })}
                    </div>

                    <div className="bg-[#FDFCDC] p-5 rounded-2xl w-full relative">
                        <div className="absolute top-0 left-4 -translate-y-1/2 text-4xl text-[#FFB5A7] opacity-50 font-serif">"</div>
                        <p className="text-sm leading-relaxed text-[#4A4A4A] font-medium text-center z-10 relative">
                            {result.description}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex gap-4 w-full">
                <a
                    href={XIAOHONGSHU_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-4 bg-[#FFB5A7] text-white rounded-[24px] font-bold text-lg shadow-cute flex justify-center items-center gap-2 no-underline"
                >
                    <Play size={20} fill="currentColor" />
                    <span>我也测一下 </span>
                </a>
            </div>
        </motion.div>
    );
}
