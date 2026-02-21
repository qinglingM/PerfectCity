import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'perfectcity_activation_code';

interface AuthContextType {
    hasAccess: boolean;
    loading: boolean;
    activationCode: string | null;
    activate: (code: string) => Promise<{ success: boolean; error?: string }>;
    clearAccess: () => void;
}

const AuthContext = createContext<AuthContextType>({
    hasAccess: false,
    loading: true,
    activationCode: null,
    activate: async () => ({ success: false }),
    clearAccess: () => { },
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [hasAccess, setHasAccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activationCode, setActivationCode] = useState<string | null>(null);

    // On mount, check if there's a saved activation code in localStorage
    useEffect(() => {
        const savedCode = localStorage.getItem(STORAGE_KEY);
        if (savedCode) {
            verifyCode(savedCode).then((valid) => {
                if (valid) {
                    setActivationCode(savedCode);
                    setHasAccess(true);
                } else {
                    localStorage.removeItem(STORAGE_KEY);
                }
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    // Verify a code exists and has been used (activated)
    const verifyCode = async (code: string): Promise<boolean> => {
        try {
            const { data, error } = await supabase
                .from('activation_codes')
                .select('id, status')
                .eq('code', code)
                .single();

            if (error || !data) return false;
            return data.status === 'used';
        } catch {
            return false;
        }
    };

    // Activate a new code
    const activate = async (code: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const normalizedCode = code.trim().toUpperCase();

            // Check if code exists
            const { data: codeData, error: fetchError } = await supabase
                .from('activation_codes')
                .select('*')
                .eq('code', normalizedCode)
                .single();

            if (fetchError || !codeData) {
                return { success: false, error: '激活码不存在，请检查后重试' };
            }

            // Check status
            if (codeData.status === 'used') {
                // Check if it's "our" code (same browser)
                const savedCode = localStorage.getItem(STORAGE_KEY);
                if (savedCode === normalizedCode) {
                    setHasAccess(true);
                    return { success: true };
                }
                return { success: false, error: '该激活码已被使用' };
            }

            if (codeData.status === 'expired') {
                return { success: false, error: '该激活码已过期' };
            }

            // Check expiry date
            if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
                return { success: false, error: '该激活码已过期' };
            }

            // Mark as used
            const { error: updateError } = await supabase
                .from('activation_codes')
                .update({
                    status: 'used',
                    used_at: new Date().toISOString()
                })
                .eq('id', codeData.id);

            if (updateError) {
                console.error('Activation update error:', updateError);
                return { success: false, error: '激活失败，请重试' };
            }

            // Save to localStorage
            localStorage.setItem(STORAGE_KEY, normalizedCode);
            setActivationCode(normalizedCode);
            setHasAccess(true);

            return { success: true };
        } catch (err) {
            console.error('Activation error:', err);
            return { success: false, error: '激活过程中出现错误' };
        }
    };

    const clearAccess = () => {
        localStorage.removeItem(STORAGE_KEY);
        setActivationCode(null);
        setHasAccess(false);
    };

    return (
        <AuthContext.Provider value={{ hasAccess, loading, activationCode, activate, clearAccess }}>
            {children}
        </AuthContext.Provider>
    );
}
