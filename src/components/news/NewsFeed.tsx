'use client';

import { useState } from 'react';
import { NewsRow } from './NewsRow';
import styles from './NewsFeed.module.css';

interface NewsFeedProps {
  initialArticles: any[];
}

const TAGS = [
  'Всі',
  'топ лаби',
  'реліз моделі',
  'продукт',
  'дослідження',
  'партнерство',
  'безпека',
  'залізо',
  'відкритий код',
  'агенти',
  'інструменти',
  'фінансування'
];

export function NewsFeed({ initialArticles }: NewsFeedProps) {
  const [activeTag, setActiveTag] = useState('Всі');

  // Filter articles based on active tag
  const filteredArticles = initialArticles.filter(article => {
    if (activeTag === 'Всі') return true;
    if (activeTag === 'топ лаби') return article.sources?.is_top_lab;
    
    // Exact match for other tags (we will need to make sure backend parsing maps to these)
    // For now we just do case-insensitive substring search in tags or fallback
    if (article.tag) {
      return article.tag.toLowerCase() === activeTag.toLowerCase();
    }
    
    return false;
  });

  // Group by "This Week" (last 7 days) and "Older"
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const thisWeek = filteredArticles.filter(a => new Date(a.published_at) >= oneWeekAgo);
  const older = filteredArticles.filter(a => new Date(a.published_at) < oneWeekAgo);

  return (
    <div className={styles.feedContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.titleGroup}>
          <h1 className={styles.mainTitle}>Новини</h1>
          <span className={styles.countBadge}>{filteredArticles.length} НОВИН ЗА ТИЖДЕНЬ</span>
        </div>
        <div className={styles.subtitleGroup}>
          <span className={styles.subtitleDot}></span>
          <span className={styles.subtitleText}>Стрічка АІ-новин з офіційних джерел · Оновлено {new Date().getHours()} годин тому</span>
        </div>
      </header>

      <div className={styles.tagsScroll}>
        <div className={styles.tagsList}>
          {TAGS.map(tag => (
            <button
              key={tag}
              className={`${styles.tagBtn} ${activeTag === tag ? styles.activeTag : ''}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.timeline}>
        {thisWeek.length > 0 && (
          <section className={styles.timeSection}>
            <div className={styles.timeHeader}>
              <h3 className={styles.timeTitle}>ЦЕЙ ТИЖДЕНЬ</h3>
              <span className={styles.timeCount}>{thisWeek.length}</span>
            </div>
            <div className={styles.articlesList}>
              {thisWeek.map(article => (
                <NewsRow key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {older.length > 0 && (
          <section className={styles.timeSection}>
            <div className={styles.timeHeader}>
              <h3 className={styles.timeTitle}>РАНІШЕ</h3>
              <span className={styles.timeCount}>{older.length}</span>
            </div>
            <div className={styles.articlesList}>
              {older.map(article => (
                <NewsRow key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {filteredArticles.length === 0 && (
          <div className={styles.emptyState}>
            За цим тегом новин поки немає.
          </div>
        )}
      </div>
    </div>
  );
}
