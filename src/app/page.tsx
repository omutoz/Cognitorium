import { supabase } from '@/lib/supabase';
import { NewsFeed } from '@/components/news/NewsFeed';

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  // Fetch latest articles
  const { data: articles, error } = await supabase
    .from('articles')
    .select(`
      id, title_ua, title_en, description_ua, description_en, url, published_at, tag,
      sources (name, color, is_top_lab)
    `)
    .order('published_at', { ascending: false })
    .limit(100); // Fetch up to 100 for the feed

  if (error) {
    console.error('Error fetching articles:', error);
  }

  // Passing data to the Client Component which handles the list UI and filtering
  return (
    <NewsFeed initialArticles={articles || []} />
  );
}
