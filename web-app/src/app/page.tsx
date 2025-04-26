import Link from "next/link";
import styles from "./landing.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Header/Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#5C6F40" fillOpacity="0.8" />
            <path d="M14 15C14 13.8954 14.8954 13 16 13H24C25.1046 13 26 13.8954 26 15V25C26 26.1046 25.1046 27 24 27H16C14.8954 27 14 26.1046 14 25V15Z" stroke="white" strokeWidth="2" />
            <path d="M18 18L22 22" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M22 18L18 22" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className={styles.navLinks}>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/login" className={styles.loginButton}>Log In</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero} style={{ backgroundImage: "url('../farmer-image.jpg')" }}>
        <div className={styles.heroContent}>
          <h1>Helping farms grow stronger through smarter support</h1>
          <p>A simple tool for farmers to assess risk, improve resilience, and get tailored guidance—online or offline.</p>
          <Link href="/register" className={styles.ctaButton}>
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 4.5C17.1956 4.5 18.3421 4.97411 19.1922 5.82417C20.0423 6.67422 20.5164 7.82075 20.5164 9.01639C20.5164 10.212 20.0423 11.3586 19.1922 12.2086C18.3421 13.0587 17.1956 13.5328 16 13.5328" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5.5 21C5.5 19.8065 5.97411 18.6619 6.82417 17.8145C7.67422 16.9671 8.82075 16.4951 10.0164 16.4951H14C15.1956 16.4951 16.3421 16.9671 17.1922 17.8145C18.0423 18.6619 18.5164 19.8065 18.5164 21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2>Input Farm Info</h2>
          <p>Enter your location and crop details easily.</p>
        </div>

        <div className={styles.featureCard} style={{ backgroundColor: "#E6D3A3" }}>
          <div className={styles.featureIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 8V12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 16H12.01" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2>Risk Detection</h2>
          <p>Get instant insights on environmental and economic threats.</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 6H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 12H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 18H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 6H3.01" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 12H3.01" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 18H3.01" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2>Get Guidance</h2>
          <p>Simple suggestions to protect your farm.</p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.infoSection}>
        <div className={styles.infoCard}>
          <h2>How It Works?</h2>
        </div>
        <div className={styles.infoImage}>
          <img src="../farmer-image.jpg" alt="Farmer in corn field" className={styles.farmerImage} />
        </div>
        <div className={styles.stepsList}>
          <ol>
            <li>Enter your location and crop info</li>
            <li>See risks identified by our engine</li>
            <li>Follow suggestions to protect your farm</li>
          </ol>
        </div>
      </section>

      {/* Why Section */}
      <section className={styles.whySection}>
        <h2>Why NourishNet?</h2>
      </section>

      {/* Accessibility Statement */}
      <section className={styles.accessibilitySection}>
        <p>
          NourishNet is designed for accessibility and impact. Whether you're in a connected city or rural area
          with spotty internet, we've got your back—with an SMS-friendly and offline-capable interface.
        </p>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#5C6F40" fillOpacity="0.8" />
            <path d="M14 15C14 13.8954 14.8954 13 16 13H24C25.1046 13 26 13.8954 26 15V25C26 26.1046 25.1046 27 24 27H16C14.8954 27 14 26.1046 14 25V15Z" stroke="white" strokeWidth="2" />
            <path d="M18 18L22 22" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M22 18L18 22" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className={styles.socialLinks}>
          <a href="#" aria-label="Facebook">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#" aria-label="Instagram">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61991 14.1902 8.22773 13.4229 8.09406 12.5922C7.9604 11.7615 8.09206 10.9099 8.47032 10.1584C8.84858 9.40685 9.45418 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8717 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17.5 6.5H17.51" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#" aria-label="Location">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#" aria-label="Email">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 6L12 13L2 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}