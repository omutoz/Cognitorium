import { createClient } from '@supabase/supabase-js';
import * as deepl from 'deepl-node';
import dotenv from 'dotenv';
import fs from 'fs';

// Load .env.local
const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const deeplKey = process.env.DEEPL_API_KEY;

if (!supabaseUrl || !supabaseKey || !deeplKey) {
  console.error("Missing environment variables!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const translator = new deepl.Translator(deeplKey);

async function run() {
  console.log("Starting translation script...");
  
  // Calculate date 14 days ago
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const dateStr = twoWeeksAgo.toISOString();
  
  // Fetch untranslated articles from last 14 days
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title_en, description_en')
    .gte('published_at', dateStr)
    .is('title_ua', null)
    .order('published_at', { ascending: false });
    
  if (error) {
    console.error("Supabase Error:", error);
    process.exit(1);
  }
  
  if (!articles || articles.length === 0) {
    console.log("No articles need translation in the last 14 days.");
    return;
  }
  
  console.log(`Found ${articles.length} articles to translate.`);
  
  // Estimate character limit (safeguard)
  let totalChars = 0;
  for (const a of articles) {
    totalChars += (a.title_en?.length || 0) + (a.description_en?.length || 0);
  }
  
  console.log(`Estimated characters to translate: ${totalChars}`);
  if (totalChars > 100000) {
    console.warn("Safety check: more than 100k chars. Aborting to save limits.");
    process.exit(1);
  }

  let translatedCount = 0;
  
  for (const article of articles) {
    try {
      let title_ua = null;
      let description_ua = null;
      
      if (article.title_en) {
        const res = await translator.translateText(article.title_en, null, 'uk');
        title_ua = res.text;
      }
      
      if (article.description_en) {
        const res = await translator.translateText(article.description_en, null, 'uk');
        description_ua = res.text;
      }
      
      // Update DB
      const { error: updateError } = await supabase
        .from('articles')
        .update({ title_ua, description_ua })
        .eq('id', article.id);
        
      if (updateError) {
        console.error(`Failed to update article ${article.id}:`, updateError);
      } else {
        translatedCount++;
        console.log(`Translated [${translatedCount}/${articles.length}]: ${article.id}`);
      }
      
      // Small delay to prevent API rate limiting
      await new Promise(r => setTimeout(r, 200));
      
    } catch (err) {
      console.error(`Translation failed for article ${article.id}:`, err);
    }
  }
  
  console.log(`Finished! Translated ${translatedCount} articles.`);
}

run();
