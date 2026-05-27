import styles from './NewsRow.module.css';

interface NewsRowProps {
  article: {
    id: string;
    title_ua: string | null;
    title_en: string | null;
    description_ua: string | null;
    description_en: string | null;
    url: string;
    published_at: string;
    tag: string | null;
    sources: { name: string; color: string | null; is_top: boolean } | null;
  };
}

export function NewsRow({ article }: NewsRowProps) {
  const title = article.title_ua || article.title_en || 'Без заголовку';
  const description = article.description_ua || article.description_en;
  const date = new Date(article.published_at).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long'
  });

  return (
    <a 
      href={article.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={styles.rowLink}
    >
      <article className={styles.row}>
        <div className={styles.meta}>
          <div className={styles.sourceGroup}>
            <span 
              className={styles.dot} 
              style={{ backgroundColor: article.sources?.color || '#ccc' }}
            />
            <span className={styles.sourceName}>
              {article.sources?.name || 'Невідоме джерело'}
            </span>
          </div>
          <span className={styles.metaDivider}>·</span>
          <time className={styles.date}>{date}</time>
          {article.tag && (
            <>
              <span className={styles.metaDivider}>·</span>
              <span className={styles.tag}>{article.tag}</span>
            </>
          )}
        </div>
        
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          {description && (
            <p className={styles.description}>{description}</p>
          )}
        </div>
      </article>
    </a>
  );
}
