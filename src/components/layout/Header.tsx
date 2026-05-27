'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Header.module.css';

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: 'Про нас', href: '/about' },
    { name: 'Новини', href: '/' },
    { name: 'Учням', href: '/students' },
    { name: 'Студентам', href: '/university' },
    { name: 'Вчителям', href: '/teachers' },
    { name: 'Інструменти', href: '/tools' },
    { name: 'Контекст', href: '/context' },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link href="/" className={styles.logoLink}>
            <Image src="/logo.png" alt="Когніторіум" width={32} height={32} className={styles.logoImg} />
            <div className={styles.brandGroup}>
              <span className={styles.brandTitle}>Когніторіум</span>
              <span className={styles.brandSubtitle}>навчайся природно зі штучним інтелектом</span>
            </div>
          </Link>
        </div>

        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className={styles.right}>
          <button 
            className={styles.langBtn}
            onClick={() => setLanguage(language === 'ua' ? 'en' : 'ua')}
          >
            {language === 'ua' ? 'ENG' : 'УКР'}
          </button>
          
          <button 
            className={`${styles.themeToggle} ${mounted && theme === 'dark' ? styles.themeToggleDark : ''}`}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            <div className={styles.themeToggleThumb}></div>
          </button>
        </div>
      </div>
    </header>
  );
}
