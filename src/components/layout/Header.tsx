import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link href="/" className={styles.logoLink}>
            <Image src="/logo.png" alt="Cognitorium" width={32} height={32} className={styles.logo} />
            <span className={styles.brand}>Cognitorium</span>
          </Link>
        </div>
        
        <div className={styles.center}>
          <nav className={styles.nav}>
            <Link href="/" className={`${styles.navLink} ${styles.active}`}>Стрічка новин</Link>
            <Link href="/analytics" className={styles.navLink}>Аналітика</Link>
            <Link href="/about" className={styles.navLink}>Про нас</Link>
          </nav>
        </div>

        <div className={styles.right}>
          {/* Theme & Language switches will go here */}
          <button className={styles.iconBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          <div className={styles.menuIcon}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </header>
  );
}
