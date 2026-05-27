import styles from './ParallelEvents.module.css';

interface ParallelEventGroup {
  tag: string;
  articles: {
    id: string;
    title_ua: string | null;
    title_en: string | null;
    url: string;
    sources: { name: string; color: string | null };
  }[];
}

interface ParallelEventsProps {
  groups: ParallelEventGroup[];
  locale?: 'ua' | 'en';
}

export function ParallelEvents({ groups, locale = 'ua' }: ParallelEventsProps) {
  if (!groups || groups.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Паралельні події</h2>
        <p className={styles.subtitle}>Один інфопривід — різні компанії (за тиждень)</p>
      </div>

      <div className={styles.scrollContainer}>
        {groups.map((group, idx) => (
          <div key={idx} className={styles.eventGroup}>
            <div className={styles.groupTag}>{group.tag}</div>
            <div className={styles.articlesList}>
              {group.articles.map((article) => {
                const title = locale === 'ua' ? (article.title_ua || article.title_en) : article.title_en;
                return (
                  <a key={article.id} href={article.url} target="_blank" rel="noopener noreferrer" className={styles.articleCard}>
                    <div 
                      className={styles.sourceIndicator} 
                      style={{ backgroundColor: article.sources.color || 'var(--accent)' }}
                    />
                    <div className={styles.articleContent}>
                      <span className={styles.sourceName}>{article.sources.name}</span>
                      <h3 className={styles.articleTitle}>{title}</h3>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
