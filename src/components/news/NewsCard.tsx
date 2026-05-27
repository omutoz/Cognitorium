import styles from './NewsCard.module.css';

interface NewsCardProps {
  article: {
    id: string;
    title_ua: string | null;
    title_en: string | null;
    description_ua: string | null;
    description_en: string | null;
    url: string;
    published_at: string | null;
    tag: string | null;
    sources: {
      name: string;
      color: string | null;
      is_top_lab: boolean;
    };
  };
  locale?: 'ua' | 'en';
}

export function NewsCard({ article, locale = 'ua' }: NewsCardProps) {
  const title = locale === 'ua' ? (article.title_ua || article.title_en) : article.title_en;
  const description = locale === 'ua' ? (article.description_ua || article.description_en) : article.description_en;
  
  // Format date
  const dateStr = article.published_at 
    ? new Date(article.published_at).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.sourceInfo}>
          <span 
            className={styles.sourceIndicator} 
            style={{ backgroundColor: article.sources.color || 'var(--accent)' }}
          />
          <span className={styles.sourceName}>{article.sources.name}</span>
          {article.sources.is_top_lab && (
            <span className={styles.topBadge}>Top</span>
          )}
        </div>
        <time className={styles.date}>{dateStr}</time>
      </div>

      <a href={article.url} target="_blank" rel="noopener noreferrer" className={styles.contentLink}>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </a>

      {article.tag && (
        <div className={styles.footer}>
          <span className={styles.tag}>{article.tag}</span>
        </div>
      )}
    </article>
  );
}
