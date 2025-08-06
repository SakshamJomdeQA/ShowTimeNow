import React from 'react';
import Link from 'next/link';
import styles from './styles/Footer.module.css';

// TypeScript interfaces for footer data
interface FooterData {
  uid: string;
  company_name: {
    company_name: string;
    info: string;
  };
  legal: {
    title: string;
    privacy_policy: {
      title: string;
      href: string;
    };
    terms_of_services: {
      title: string;
      href: string;
    };
  };
  menu: {
    title: string;
    homepage: {
      title: string;
      href: string;
    };
    movies: {
      title: string;
      href: string;
    };
    events: {
      title: string;
      href: string;
    };
    shows: {
      title: string;
      href: string;
    };
  };
}

interface FooterProps {
  data: FooterData | null;
}

const Footer: React.FC<FooterProps> = ({ data }) => {
  if (!data) {
    return <div className={styles.footer}>Loading...</div>;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Company Information Section */}
        <div className={styles.companySection}>
          <div className={styles.companyInfo}>
            <h3 className={styles.companyName}>{data.company_name.company_name}</h3>
            <p className={styles.companyDescription}>{data.company_name.info}</p>
          </div>
        </div>

        {/* Menu Section */}
        <div className={styles.menuSection}>
          <h4 className={styles.sectionTitle}>Quick Links</h4>
          <nav className={styles.menuNav}>
            <Link href={data.menu.homepage.href} className={styles.menuLink}>
              {data.menu.homepage.title}
            </Link>
            <Link href={data.menu.movies.href} className={styles.menuLink}>
              {data.menu.movies.title}
            </Link>
            <Link href={data.menu.events.href} className={styles.menuLink}>
              {data.menu.events.title}
            </Link>
            <Link href={data.menu.shows.href} className={styles.menuLink}>
              {data.menu.shows.title}
            </Link>
          </nav>
        </div>

        {/* Legal Section */}
        <div className={styles.legalSection}>
          <h4 className={styles.sectionTitle}>{data.legal.title}</h4>
          <nav className={styles.legalNav}>
            <Link href={data.legal.privacy_policy.href} className={styles.legalLink}>
              {data.legal.privacy_policy.title}
            </Link>
            <Link href={data.legal.terms_of_services.href} className={styles.legalLink}>
              {data.legal.terms_of_services.title}
            </Link>
          </nav>
        </div>
      </div>

      {/* Copyright Section */}
      <div className={styles.copyrightSection}>
        <div className={styles.copyrightContainer}>
          <p className={styles.copyrightText}>
            © {new Date().getFullYear()} {data.company_name.company_name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 