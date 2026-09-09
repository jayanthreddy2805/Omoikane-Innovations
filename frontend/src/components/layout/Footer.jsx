import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <iframe 
        src="/morph-animation.html" 
        className={styles.footerBackground} 
        frameBorder="0" 
        scrolling="no" 
        title="Interactive Morph Background"
      />
    </footer>
  );
}
