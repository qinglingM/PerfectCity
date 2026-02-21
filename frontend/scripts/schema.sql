-- 完整建表 SQL（Supabase / PostgreSQL）
-- 如果需要从头建表，在 Supabase SQL Editor 运行此文件
-- 注意：如果表已存在，需要先运行 migrate-v2.sql 来升级

-- ============================================
-- 1. activation_codes 激活码表
-- ============================================
CREATE TABLE IF NOT EXISTS activation_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(32) NOT NULL UNIQUE,
    batch_no VARCHAR(32) DEFAULT NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'unused',  -- unused / used / expired
    order_id VARCHAR(64) DEFAULT NULL,
    used_by_user_id TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    used_at TIMESTAMPTZ DEFAULT NULL,
    expires_at TIMESTAMPTZ DEFAULT NULL
);

-- ============================================
-- 2. shared_results 分享结果表
-- ============================================
CREATE TABLE IF NOT EXISTS shared_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    share_id TEXT UNIQUE NOT NULL,
    city_name TEXT NOT NULL,
    match_percent INTEGER NOT NULL,
    tags TEXT[] NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 3. 启用 RLS
-- ============================================
ALTER TABLE activation_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_results ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. activation_codes RLS 策略
-- ============================================
CREATE POLICY "Anyone can read activation codes"
    ON activation_codes FOR SELECT USING (true);

CREATE POLICY "Anyone can activate unused codes"
    ON activation_codes FOR UPDATE
    USING (status = 'unused')
    WITH CHECK (true);

-- ============================================
-- 5. shared_results RLS 策略
-- ============================================
CREATE POLICY "Anyone can read shared results"
    ON shared_results FOR SELECT USING (true);

CREATE POLICY "Anyone can create shared results"
    ON shared_results FOR INSERT WITH CHECK (true);

-- ============================================
-- 6. 索引
-- ============================================
CREATE INDEX IF NOT EXISTS idx_activation_codes_code ON activation_codes(code);
CREATE INDEX IF NOT EXISTS idx_activation_codes_status ON activation_codes(status);
CREATE INDEX IF NOT EXISTS idx_activation_codes_batch ON activation_codes(batch_no);
CREATE INDEX IF NOT EXISTS idx_shared_results_share_id ON shared_results(share_id);
