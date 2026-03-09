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

    // Verify a code exists in the database (allows unlimited reuse)
    const verifyCode = async (code: string): Promise<boolean> => {
        try {
            const { data, error } = await supabase
                .from('activation_codes')
                .select('id')
                .eq('code', code)
                .single();

            if (error || !data) return false;
            return true;
        } catch {
            return false;
        }
    };

    // Activate a code (unlimited reuse — only checks if code exists)
    const activate = async (code: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const normalizedCode = code.trim().toUpperCase();

            // Check if code exists
            const { data: codeData, error: fetchError } = await supabase
                .from('activation_codes')
                .select('id, code, expires_at')
                .eq('code', normalizedCode)
                .single();

            if (fetchError || !codeData) {
                return { success: false, error: '激活码不存在，请检查后重试' };
            }

            // Check expiry date
            if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
                return { success: false, error: '该激活码已过期' };
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
