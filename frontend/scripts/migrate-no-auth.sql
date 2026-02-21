-- 修复 RLS 策略：完整的一步到位迁移
-- 在 Supabase SQL Editor 中运行

-- 1. 删除所有旧策略（不管存不存在）
DROP POLICY IF EXISTS "Users can read own activation codes" ON activation_codes;
DROP POLICY IF EXISTS "Users can activate unused codes" ON activation_codes;
DROP POLICY IF EXISTS "Anyone can read activation codes" ON activation_codes;
DROP POLICY IF EXISTS "Anyone can activate unused codes" ON activation_codes;
DROP POLICY IF EXISTS "Anyone can read shared results" ON shared_results;
DROP POLICY IF EXISTS "Authenticated users can create shared results" ON shared_results;
DROP POLICY IF EXISTS "Anyone can create shared results" ON shared_results;

-- 2. 删除 user_id 列（如果还存在）
ALTER TABLE activation_codes DROP COLUMN IF EXISTS user_id;
ALTER TABLE shared_results DROP COLUMN IF EXISTS user_id;
DROP INDEX IF EXISTS idx_activation_codes_user;

-- 3. 创建新的 RLS 策略
CREATE POLICY "Anyone can read activation codes"
    ON activation_codes FOR SELECT USING (true);

-- 关键修复：WITH CHECK (true) 允许 used 从 false 变为 true
CREATE POLICY "Anyone can activate unused codes"
    ON activation_codes FOR UPDATE
    USING (used = false)
    WITH CHECK (true);

CREATE POLICY "Anyone can read shared results"
    ON shared_results FOR SELECT USING (true);

CREATE POLICY "Anyone can create shared results"
    ON shared_results FOR INSERT WITH CHECK (true);
