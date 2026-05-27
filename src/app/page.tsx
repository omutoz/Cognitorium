import { supabase } from '@/lib/supabase';
import { NewsCard } from '@/components/news/NewsCard';
import { ParallelEvents } from '@/components/news/ParallelEvents';
import styles from './page.module.css';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  // Fetch latest articles
  const { data: articles, error } = await supabase
    .from('articles')
    .select(`
      id, title_ua, title_en, description_ua, description_en, url, published_at, tag,
      sources (name, color, is_top_lab)
    `)
    .order('published_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching articles:', error);
  }

  // Group parallel events (same tag, different sources, within 7 days)
  // For MVP, we simply group by tag where count > 1
  const groupsMap = new Map();
  
  (articles as any[])?.forEach(article => {
    if (article.tag) {
      if (!groupsMap.has(article.tag)) {
        groupsMap.set(article.tag, []);
      }
      groupsMap.get(article.tag).push(article);
    }
  });

  const parallelGroups = Array.from(groupsMap.entries())
    .filter(([_, groupArticles]) => {
      // Must have at least 2 different sources
      const sources = new Set(groupArticles.map((a: any) => a.sources?.name));
      return sources.size > 1;
    })
    .map(([tag, groupArticles]) => ({
      tag,
      articles: groupArticles
    }));

  return (
    <div className={styles.container}>
      {parallelGroups.length > 0 && (
        <ParallelEvents groups={parallelGroups} locale="ua" />
      )}
      
      <section className={styles.newsSection}>
        <div className={styles.filters}>
          <button className={`${styles.filterBtn} ${styles.active}`}>Всі новини</button>
          <button className={styles.filterBtn}>Топ-лабораторії</button>
          <button className={styles.filterBtn}>NVIDIA</button>
        </div>

        <div className={styles.grid}>
          {articles?.map(article => (
            // @ts-ignore - type mismatch due to join
            <NewsCard key={article.id} article={article} locale="ua" />
          ))}
          
          {(!articles || articles.length === 0) && (
            <div className={styles.emptyState}>
              <p>Новин ще немає. Скоро тут з'являться перші публікації!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
