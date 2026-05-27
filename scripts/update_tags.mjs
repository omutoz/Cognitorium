import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Load .env.local
const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Starting tag update script...");
  
  // Fetch all articles
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title_en, description_en, tag');
    
  if (error) {
    console.error("Supabase Error:", error);
    process.exit(1);
  }
  
  if (!articles || articles.length === 0) {
    console.log("No articles found.");
    return;
  }
  
  console.log(`Found ${articles.length} articles to check.`);
  let updatedCount = 0;
  
  for (const article of articles) {
    const rawDesc = article.description_en || '';
    const title = article.title_en || '';
    
    let tag = null;
    const searchString = `${title} ${rawDesc}`.toLowerCase();
    
    if (/\b(agent|agentic|autonomous)\b/.test(searchString)) {
      tag = 'agents';
    } else if (/\b(gpu|chip|hardware|accelerator|tpu|npu|supercomputer|blackwell|h100)\b/.test(searchString)) {
      tag = 'hardware';
    } else if (/\b(funding|raises|invests|seed|series a|series b)\b/.test(searchString)) {
      tag = 'funding';
    } else if (/\b(safety|alignment|evaluations|ethics|responsible|guardrails)\b/.test(searchString)) {
      tag = 'safety';
    } else if (/\b(open source|open-source|open weights)\b/.test(searchString)) {
      tag = 'open_source';
    } else if (/\b(research|paper|study|discovers|proposes|methodology)\b/.test(searchString)) {
      tag = 'research';
    } else if (/\b(partners|partnership|collaboration|teams up|joins)\b/.test(searchString)) {
      tag = 'partnership';
    } else if (/\b(release|launches|unveils|announcing|gpt-4|claude 3|gemini 1\.5|llama 3)\b/.test(searchString)) {
      tag = 'model_release';
    } else if (/\b(api|sdk|framework|library|developer tool)\b/.test(searchString)) {
      tag = 'tools';
    } else if (/\b(product|feature|app|platform|enterprise)\b/.test(searchString)) {
      tag = 'product';
    }

    if (article.tag !== tag && tag !== null) {
      // Update DB
      const { error: updateError } = await supabase
        .from('articles')
        .update({ tag })
        .eq('id', article.id);
        
      if (updateError) {
        console.error(`Failed to update tag for article ${article.id}:`, updateError);
      } else {
        updatedCount++;
        console.log(`Updated tag to '${tag}' for article: ${title.slice(0, 50)}...`);
      }
    }
  }
  
  console.log(`Finished! Updated tags for ${updatedCount} articles.`);
}

run();
