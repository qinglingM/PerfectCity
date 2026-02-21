-- 升级迁移：从旧表结构升级到新版
-- 在 Supabase SQL Editor 中运行

-- ============================================
-- 1. 删除所有旧的 RLS 策略
-- ============================================
DROP POLICY IF EXISTS "Users can read own activation codes" ON activation_codes;
DROP POLICY IF EXISTS "Users can activate unused codes" ON activation_codes;
DROP POLICY IF EXISTS "Anyone can read activation codes" ON activation_codes;
DROP POLICY IF EXISTS "Anyone can activate unused codes" ON activation_codes;
DROP POLICY IF EXISTS "Anyone can read shared results" ON shared_results;
DROP POLICY IF EXISTS "Authenticated users can create shared results" ON shared_results;
DROP POLICY IF EXISTS "Anyone can create shared results" ON shared_results;

-- ============================================
-- 2. 升级 activation_codes 表结构
-- ============================================
-- 删除旧字段
ALTER TABLE activation_codes DROP COLUMN IF EXISTS user_id;
ALTER TABLE activation_codes DROP COLUMN IF EXISTS used;
DROP INDEX IF EXISTS idx_activation_codes_user;

-- 添加新字段（如果不存在）
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activation_codes' AND column_name = 'status') THEN
        ALTER TABLE activation_codes ADD COLUMN status VARCHAR(16) NOT NULL DEFAULT 'unused';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activation_codes' AND column_name = 'batch_no') THEN
        ALTER TABLE activation_codes ADD COLUMN batch_no VARCHAR(32) DEFAULT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activation_codes' AND column_name = 'order_id') THEN
        ALTER TABLE activation_codes ADD COLUMN order_id VARCHAR(64) DEFAULT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activation_codes' AND column_name = 'used_by_user_id') THEN
        ALTER TABLE activation_codes ADD COLUMN used_by_user_id TEXT DEFAULT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activation_codes' AND column_name = 'used_at') THEN
        ALTER TABLE activation_codes ADD COLUMN used_at TIMESTAMPTZ DEFAULT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activation_codes' AND column_name = 'expires_at') THEN
        ALTER TABLE activation_codes ADD COLUMN expires_at TIMESTAMPTZ DEFAULT NULL;
    END IF;
END $$;

-- 升级 shared_results 表
ALTER TABLE shared_results DROP COLUMN IF EXISTS user_id;

-- ============================================
-- 3. 新建索引
-- ============================================
CREATE INDEX IF NOT EXISTS idx_activation_codes_status ON activation_codes(status);
CREATE INDEX IF NOT EXISTS idx_activation_codes_batch ON activation_codes(batch_no);

-- ============================================
-- 4. 创建新的 RLS 策略
-- ============================================
CREATE POLICY "Anyone can read activation codes"
    ON activation_codes FOR SELECT USING (true);

CREATE POLICY "Anyone can activate unused codes"
    ON activation_codes FOR UPDATE
    USING (status = 'unused')
    WITH CHECK (true);

CREATE POLICY "Anyone can read shared results"
    ON shared_results FOR SELECT USING (true);

CREATE POLICY "Anyone can create shared results"
    ON shared_results FOR INSERT WITH CHECK (true);

-- ============================================
-- 5. 插入测试码
-- ============================================
INSERT INTO activation_codes (code, batch_no, status) VALUES ('CITY-TEST-0001', 'TEST', 'unused')
ON CONFLICT (code) DO UPDATE SET status = 'unused', used_at = NULL;
