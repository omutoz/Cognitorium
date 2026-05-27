import { useLanguage } from '@/contexts/LanguageContext';
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

export function NewsRow({ article }: NewsRowProps) {
  const { language } = useLanguage();
  
  const title = language === 'ua' ? (article.title_ua || article.title_en) : (article.title_en || article.title_ua);
  const description = language === 'ua' ? (article.description_ua || article.description_en) : (article.description_en || article.description_ua);
  
  const date = new Date(article.published_at).toLocaleDateString(language === 'ua' ? 'uk-UA' : 'en-US', {
    day: 'numeric',
    month: 'long'
  });

  const displayTag = article.tag && TAG_DICT[article.tag] ? TAG_DICT[article.tag][language] : article.tag;

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
            <span 
              className={styles.sourceName}
              style={{ color: article.sources?.color || 'var(--text-primary)' }}
            >
              {article.sources?.name || 'Невідоме джерело'}
            </span>
          </div>
          <span className={styles.metaDivider}>·</span>
          <time className={styles.date}>{date}</time>
          {displayTag && (
            <span className={styles.tag}>{displayTag}</span>
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
