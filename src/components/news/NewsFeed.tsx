'use client';

import { useState } from 'react';
import { NewsRow } from './NewsRow';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './NewsFeed.module.css';

interface NewsFeedProps {
  initialArticles: any[];
}

const TAG_DICT: Record<string, { ua: string, en: string }> = {
  'all': { ua: 'Всі', en: 'All' },
  'top_labs': { ua: 'топ лаби', en: 'Top Labs' },
  'model_release': { ua: 'реліз моделі', en: 'Model Release' },
  'product': { ua: 'продукт', en: 'Product' },
  'research': { ua: 'дослідження', en: 'Research' },
  'partnership': { ua: 'партнерство', en: 'Partnership' },
  'safety': { ua: 'безпека', en: 'Safety' },
  'hardware': { ua: 'залізо', en: 'Hardware' },
  'open_source': { ua: 'відкритий код', en: 'Open Source' },
  'agents': { ua: 'агенти', en: 'Agents' },
  'tools': { ua: 'інструменти', en: 'Tools' },
  'funding': { ua: 'фінансування', en: 'Funding' }
};

const TAG_KEYS = Object.keys(TAG_DICT);

export function NewsFeed({ initialArticles }: NewsFeedProps) {
  const { language } = useLanguage();
  const [activeTag, setActiveTag] = useState('all');
  const [weeksLoaded, setWeeksLoaded] = useState(1);

  // Filter articles based on active tag
  const filteredArticles = initialArticles.filter(article => {
    if (activeTag === 'all') return true;
    if (activeTag === 'top_labs') return article.sources?.is_top_lab;
    
    if (article.tag) {
      return article.tag === activeTag;
    }
    
    return false;
  });

  // Calculate weeks
  const now = new Date();
  const weeksData = [];
  
  for (let i = 0; i < weeksLoaded; i++) {
    const end = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const start = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
    
    const weekArticles = filteredArticles.filter(a => {
      const pub = new Date(a.published_at);
      return pub >= start && pub < end;
    });
    
    if (weekArticles.length > 0) {
      weeksData.push({
        index: i,
        title: i === 0 ? (language === 'ua' ? 'ЦЕЙ ТИЖДЕНЬ' : 'THIS WEEK') : (language === 'ua' ? `${i} ТИЖНІВ ТОМУ` : `${i} WEEKS AGO`),
        articles: weekArticles
      });
    }
  }

  const currentWeekCount = weeksData.length > 0 && weeksData[0].index === 0 ? weeksData[0].articles.length : 0;

  return (
    <div className={styles.feedContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.titleGroup}>
          <h1 className={styles.mainTitle}>{language === 'ua' ? 'Новини' : 'News'}</h1>
          <span className={styles.countBadge}>
            {currentWeekCount} {language === 'ua' ? 'НОВИН ЗА ТИЖДЕНЬ' : 'NEWS THIS WEEK'}
          </span>
        </div>
        <div className={styles.subtitleGroup}>
          <span className={styles.subtitleDot}></span>
          <span className={styles.subtitleText}>
            {language === 'ua' ? 'Стрічка АІ-новин з офіційних джерел' : 'AI news feed from official sources'} · {language === 'ua' ? 'Оновлено нещодавно' : 'Updated recently'}
          </span>
        </div>
      </header>

      <div className={styles.tagsContainer}>
        <div className={styles.tagsList}>
          {TAG_KEYS.map(tagKey => (
            <button
              key={tagKey}
              className={`${styles.tagBtn} ${activeTag === tagKey ? styles.activeTag : ''}`}
              onClick={() => setActiveTag(tagKey)}
            >
              {TAG_DICT[tagKey][language]}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.timeline}>
        {weeksData.map(week => (
          <section key={week.index} className={styles.timeSection}>
            <div className={styles.timeHeader}>
              <h3 className={styles.timeTitle}>{week.title}</h3>
              <div className={styles.timeLine}></div>
              <span className={styles.timeCount}>{week.articles.length}</span>
            </div>
            <div className={styles.articlesList}>
              {week.articles.map((article: any) => (
                <NewsRow key={article.id} article={article} />
              ))}
            </div>
          </section>
        ))}

        {filteredArticles.length === 0 && (
          <div className={styles.emptyState}>
            {language === 'ua' ? 'За цим тегом новин поки немає.' : 'No news found for this tag.'}
          </div>
        )}
        
        {weeksLoaded < 8 && filteredArticles.length > 0 && (
          <button className={styles.loadMoreBtn} onClick={() => setWeeksLoaded(w => w + 1)}>
            {language === 'ua' ? 'Показати попередній тиждень' : 'Show previous week'}
          </button>
        )}
      </div>
    </div>
  );
}
