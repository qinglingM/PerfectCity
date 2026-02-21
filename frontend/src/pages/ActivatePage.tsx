import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type ActivateState = 'INPUT' | 'LOADING' | 'SUCCESS' | 'ERROR';

export default function ActivatePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const codeFromUrl = searchParams.get('code');
    const { activate, hasAccess } = useAuth();

    const [state, setState] = useState<ActivateState>(codeFromUrl ? 'LOADING' : 'INPUT');
    const [code, setCode] = useState(codeFromUrl || '');
    const [error, setError] = useState('');

    // If already has access, redirect to quiz
    useEffect(() => {
        if (hasAccess) {
            navigate('/quiz', { replace: true });
        }
    }, [hasAccess]);

    // If code came from URL, auto-activate
    useEffect(() => {
        if (codeFromUrl) {
            handleActivate(codeFromUrl);
        }
    }, []);

    const handleActivate = async (activationCode: string) => {
        if (!activationCode.trim()) {
            setError('请输入激活码');
            return;
        }

        setState('LOADING');
        setError('');

        const result = await activate(activationCode);

        if (result.success) {
            setState('SUCCESS');
        } else {
            setState('ERROR');
            setError(result.error || '激活失败');
        }
    };

    const handleSubmit = () => {
        handleActivate(code);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#FFF2ED] to-[#FFCAD4]"
        >
            {state === 'INPUT' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex flex-col items-center"
                >
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-cute mb-6">
                        <KeyRound size={36} className="text-[#FFB5A7]" />
                    </div>

                    <h2 className="text-2xl font-black text-[#4A4A4A] mb-2">输入激活码</h2>
                    <p className="text-[#9B9B9B] text-sm mb-8 text-center">
                        购买后收到的激活码，输入即可开始测试
                    </p>

                    <div className="w-full bg-white rounded-[28px] p-6 shadow-2xl">
                        <div className="flex items-center gap-3 bg-[#FDFCDC] p-4 rounded-2xl mb-4">
                            <KeyRound size={20} className="text-[#9B9B9B] flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="例如：CITY-XXXX-XXXX"
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value.toUpperCase());
                                    setError('');
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                className="flex-1 bg-transparent outline-none text-lg text-[#4A4A4A] placeholder-[#C0C0C0] tracking-wider font-mono"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!code.trim()}
                            className="w-full py-4 bg-[#FFB5A7] text-white rounded-2xl font-bold text-lg shadow-cute disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                        >
                            激活
                        </button>

                        {error && (
                            <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
                        )}
                    </div>
                </motion.div>
            )}

            {state === 'LOADING' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center"
                >
                    <motion.div
                        animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-cute mb-6"
                    >
                        <Loader2 size={36} className="text-[#84DCC6] animate-spin" />
                    </motion.div>
                    <h2 className="text-xl font-bold text-[#4A4A4A]">正在激活...</h2>
                </motion.div>
            )}

            {state === 'SUCCESS' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    className="w-full flex flex-col items-center"
                >
                    <div className="w-20 h-20 bg-[#84DCC6] rounded-full flex items-center justify-center shadow-cute mb-6">
                        <CheckCircle size={40} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-[#4A4A4A] mb-2">激活成功！🎉</h2>
                    <p className="text-[#9B9B9B] text-sm mb-8">可以无限次重测哦</p>
                    <button
                        onClick={() => navigate('/quiz', { replace: true })}
                        className="w-full py-4 bg-[#FFB5A7] text-white rounded-2xl font-bold text-lg shadow-cute"
                    >
                        立即开始测试
                    </button>
                </motion.div>
            )}

            {state === 'ERROR' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full flex flex-col items-center"
                >
                    <div className="w-20 h-20 bg-[#FFCAD4] rounded-full flex items-center justify-center shadow-cute mb-6">
                        <XCircle size={40} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-[#4A4A4A] mb-2">激活失败</h2>
                    <p className="text-[#9B9B9B] text-sm mb-8">{error}</p>
                    <div className="w-full flex flex-col gap-3">
                        <button
                            onClick={() => { setState('INPUT'); setError(''); }}
                            className="w-full py-4 bg-[#FFB5A7] text-white rounded-2xl font-bold text-lg shadow-cute"
                        >
                            重新输入
                        </button>
                        <button
                            onClick={() => navigate('/', { replace: true })}
                            className="w-full py-3 text-[#9B9B9B] font-medium"
                        >
                            返回首页
                        </button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
