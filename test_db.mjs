import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Load .env.local manually for this simple test script
const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Ключі не знайдено! Перевірте .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Підключення до Supabase...");
  
  const { data, error } = await supabase
    .from('sources')
    .select('name, method')
    .limit(3);

  if (error) {
    console.error("❌ Помилка підключення або доступу:", error.message);
  } else {
    console.log("✅ Успіх! База працює. Ось перші 3 джерела з неї:");
    console.log(data);
  }
}

test();
