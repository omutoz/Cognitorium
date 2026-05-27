import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import Parser from 'rss-parser';

// Note: In a real scenario for Vercel Hobby, this might timeout if too many sources. 
// We process them sequentially or in small batches.

export async function GET(req: Request) {
  try {
    // 1. Verify cron secret (if set) to prevent unauthorized triggering
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const supabase = getServiceSupabase();
    
    // 2. Fetch active sources
    const { data: sources, error } = await supabase
      .from('sources')
      .select('*')
      .eq('is_active', true);

    if (error || !sources) {
      throw new Error(`Failed to fetch sources: ${error?.message}`);
    }

    const parser = new Parser();
    const newArticles: any[] = [];

    // 3. Process each source
    const activeSources = (sources as any[]) || [];
    for (const source of activeSources) {
      try {
        if (source.method === 'rss' && source.feed_url) {
          const feed = await parser.parseURL(source.feed_url);
          
          for (const item of feed.items) {
            if (!item.link) continue;

            // NVIDIA filtering
            let shouldInclude = true;
            if (source.name === 'NVIDIA Newsroom') {
              const content = `${item.title} ${item.contentSnippet || ''}`.toLowerCase();
              if (!content.includes('ai') && !content.includes('artificial intelligence') && !content.includes('llm')) {
                shouldInclude = false;
              }
            } else if (source.name === 'NVIDIA Developer') {
              const categories = item.categories || [];
              if (!categories.some(c => typeof c === 'string' && c.toLowerCase().includes('ai'))) {
                shouldInclude = false;
              }
            }

            if (!shouldInclude) continue;

            // Determine tag (simplified logic)
            let tag = null;
            if (item.title?.toLowerCase().includes('gpt') || item.title?.toLowerCase().includes('claude') || item.title?.toLowerCase().includes('gemini')) {
              tag = 'LLM Releases';
            } else if (item.title?.toLowerCase().includes('funding') || item.title?.toLowerCase().includes('raises')) {
              tag = 'Funding';
            }

            newArticles.push({
              source_id: source.id,
              url: item.link,
              title_en: item.title,
              description_en: item.contentSnippet?.slice(0, 500),
              published_at: item.isoDate || item.pubDate ? new Date(item.isoDate || item.pubDate!).toISOString() : new Date().toISOString(),
              tag: tag
            });
          }
        } 
        else if (source.method === 'html') {
          // Placeholder for HTML fetching (since some need __NEXT_DATA__ parsing)
          // E.g., fetch(source.url), parse HTML, extract articles
          console.log(`Skipping HTML fetch for ${source.name} in this MVP pass.`);
        }
      } catch (err) {
        console.error(`Error processing source ${source.name}:`, err);
      }
    }

    // 4. Insert into database (ignoring duplicates because url is UNIQUE)
    if (newArticles.length > 0) {
      const { error: insertError } = await supabase
        .from('articles')
        .upsert(newArticles as any, { onConflict: 'url', ignoreDuplicates: true });
        
      if (insertError) {
        console.error('Insert error:', insertError);
      }
    }

    return NextResponse.json({ success: true, processed: newArticles.length });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
