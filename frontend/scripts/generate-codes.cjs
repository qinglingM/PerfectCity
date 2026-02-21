const crypto = require("node:crypto");
const fs = require("node:fs");

const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // 去掉易混淆字符 0/O, 1/I/L

function randomPart(length = 4) {
    let s = "";
    for (let i = 0; i < length; i++) {
        const idx = crypto.randomInt(0, CODE_CHARS.length);
        s += CODE_CHARS[idx];
    }
    return s;
}

function generateCode() {
    return `${randomPart(4)}-${randomPart(4)}-${randomPart(4)}`;
}

function generateBatch(count = 1000) {
    const set = new Set();
    while (set.size < count) {
        set.add(generateCode());
    }
    return [...set];
}

// ========== 配置 ==========
const COUNT = parseInt(process.argv[2] || "1000", 10);
const BATCH_NO = process.argv[3] || `BATCH-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`;

// 生成激活码
const codes = generateBatch(COUNT);

// 导出 CSV（方便导入小红书卡密工具 + Supabase）
const csvLines = ["code,batch_no,status"];
for (const c of codes) {
    csvLines.push(`${c},${BATCH_NO},unused`);
}

const filename = `activation_codes_${BATCH_NO}.csv`;
fs.writeFileSync(filename, csvLines.join("\n"), "utf8");

// 导出 SQL（方便直接在 Supabase SQL Editor 里运行）
const sqlLines = [
    `-- 批量插入激活码 (批次: ${BATCH_NO})`,
    `-- 生成时间: ${new Date().toISOString()}`,
    `-- 数量: ${COUNT}`,
    "",
    "INSERT INTO activation_codes (code, batch_no, status) VALUES"
];
for (let i = 0; i < codes.length; i++) {
    const comma = i < codes.length - 1 ? "," : ";";
    sqlLines.push(`  ('${codes[i]}', '${BATCH_NO}', 'unused')${comma}`);
}

const sqlFilename = `activation_codes_${BATCH_NO}.sql`;
fs.writeFileSync(sqlFilename, sqlLines.join("\n"), "utf8");

console.log(`\n✅ 已生成 ${codes.length} 个激活码（批次: ${BATCH_NO}）`);
console.log(`📄 CSV 文件: ${filename}`);
console.log(`📄 SQL 文件: ${sqlFilename}`);
console.log(`\n示例码:`);
codes.slice(0, 5).forEach(c => console.log(`  ${c}`));
console.log(`  ...（共 ${codes.length} 个）\n`);
