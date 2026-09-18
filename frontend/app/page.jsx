"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus, SunMedium } from "lucide-react";
import heroModel from "../assets/images/pincher-hero-model-hires.png";
import cardigan from "../assets/images/pincher-cardigan.png";
import trousers from "../assets/images/pincher-trousers.png";
import handbag from "../assets/images/pincher-handbag.png";
import sneakers from "../assets/images/pincher-sneakers.png";
import sunglasses from "../assets/images/pincher-sunglasses.png";
import styles from "./landing.module.css";

const wardrobeItems = [
  { src: cardigan, alt: "Cream knit cardigan" },
  { src: trousers, alt: "Chocolate brown trousers" },
  { src: handbag, alt: "Cognac leather handbag" },
  { src: sneakers, alt: "White leather sneakers" },
];

const outfitItems = [
  { src: cardigan, alt: "Cream knit sweater", className: styles.outfitMain },
  { src: trousers, alt: "Brown wide-leg trousers", className: styles.outfitMain },
  { src: sneakers, alt: "White leather sneakers", className: styles.outfitSmall },
  { src: handbag, alt: "Brown leather handbag", className: styles.outfitSmall },
  { src: sunglasses, alt: "Tortoiseshell sunglasses", className: styles.outfitSmall },
];

function ProductImage({ item }) {
  return (
    <div className={`${styles.productImage} ${item.className || ""}`}>
      <Image src={item.src} alt={item.alt} fill sizes="(max-width: 800px) 28vw, 10vw" />
    </div>
  );
}

export default function Home() {
  return (
    <main className={styles.landing}>
      <section className={styles.hero} aria-label="Pincher personal styling">
        <div className={styles.heroBackdrop} aria-hidden="true" />

        <div className={styles.heroGrid}>
          <div className={styles.copyColumn}>
            <div className={styles.brand}>
              <span className={styles.brandMark}>P</span>
              <span className={styles.brandName}>PINCHER</span>
              <span className={styles.brandRule} />
              <span className={styles.brandTagline}>A SMARTER YOU</span>
            </div>

            <div className={styles.copyContent}>
              <p className={styles.eyebrow}>YOUR WARDROBE. A SMARTER YOU.</p>
              <h1 className={styles.headline}>
                <span>Outfits</span>
                <span>that feel like</span>
                <span className={styles.headlineAccent}>you.</span>
              </h1>
              <p className={styles.description}>
                Pincher uses AI to style your real clothes —<br />
                for your weather, your plans, and your unique style.
              </p>
              <div className={styles.actions}>
                <Link href="/dashboard" className={styles.primaryAction}>
                  Get Started <ArrowRight aria-hidden="true" />
                </Link>
                <Link href="/dashboard" className={styles.secondaryAction}>Login</Link>
              </div>
            </div>

            <div className={styles.stats} aria-label="Pincher highlights">
              <div className={styles.stat}><strong>10K+</strong><span>Happy Users</span></div>
              <div className={styles.stat}><strong>4.8<span className={styles.star}>★</span></strong><span>App Rating</span></div>
              <div className={styles.stat}><strong>Smarter</strong><span>Everyday Style</span></div>
            </div>
            <div className={styles.pageBadge} aria-hidden="true">1</div>
          </div>

          <div className={styles.modelColumn}>
            <div className={styles.modelFrame}>
              <Image
                src={heroModel}
                alt="Woman wearing an ivory sweater and brown trousers in a warm fashion interior"
                fill
                priority
                unoptimized
                sizes="(max-width: 900px) 100vw, 42vw"
                className={styles.model}
              />
            </div>
            <div className={`${styles.annotation} ${styles.annotationTop}`} aria-hidden="true">
              <span>Smart clothes</span><span>that look</span><span>good on you</span><b>♡</b>
            </div>
            <svg className={styles.topArrow} viewBox="0 0 150 80" aria-hidden="true">
              <path d="M3 64 C52 60 76 20 141 23" /><path d="M128 15 L142 23 L129 33" />
            </svg>
          </div>

          <aside className={styles.cardsColumn} aria-label="Wardrobe preview">
            <article className={`${styles.card} ${styles.wardrobeCard}`}>
              <header className={styles.cardHeader}><strong>Your Wardrobe</strong><span>24 items</span></header>
              <div className={styles.wardrobeRow}>
                {wardrobeItems.map((item) => <ProductImage key={item.alt} item={item} />)}
                <div className={styles.addButton} aria-label="Add wardrobe item"><Plus aria-hidden="true" /></div>
              </div>
            </article>

            <article className={`${styles.card} ${styles.outfitCard}`}>
              <header className={styles.cardHeader}>
                <strong>Today&apos;s Outfit</strong>
                <span className={styles.weather}><SunMedium aria-hidden="true" />24°C · Clear</span>
              </header>
              <div className={styles.outfitGrid}>
                {outfitItems.map((item) => <ProductImage key={item.alt} item={item} />)}
              </div>
            </article>

            <div className={`${styles.annotation} ${styles.annotationBottom}`} aria-hidden="true">
              <span>Weather</span><span>Ready</span><span>Style</span><b>♡</b>
            </div>
            <svg className={styles.bottomArrow} viewBox="0 0 90 100" aria-hidden="true">
              <path d="M3 8 C42 18 26 58 78 75" /><path d="M66 66 L79 76 L64 82" />
            </svg>
          </aside>
        </div>
      </section>
    </main>
  );
}
