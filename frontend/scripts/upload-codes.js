import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    try {
        const csvData = fs.readFileSync(path.resolve(process.cwd(), 'activation_codes_BATCH-20260221.csv'), 'utf8');
        const lines = csvData.split('\n').filter(line => line.trim() !== '');

        // Skip header line
        const codes = lines.slice(1).map(line => {
            const [code, batch_no, status] = line.split(',');
            return { code, batch_no, status: status.trim() };
        });

        console.log(`Found ${codes.length} codes. Inserting...`);

        // Insert in batches of 100 to avoid request size limits
        const batchSize = 100;
        for (let i = 0; i < codes.length; i += batchSize) {
            const batch = codes.slice(i, i + batchSize);
            const { data, error } = await supabase
                .from('activation_codes')
                .upsert(batch, { onConflict: 'code', ignoreDuplicates: true });

            if (error) {
                console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
            } else {
                console.log(`Inserted batch ${i / batchSize + 1}`);
            }
        }

        console.log('Done inserting codes.');
    } catch (err) {
        console.error('Script error:', err);
    }
}

main();
