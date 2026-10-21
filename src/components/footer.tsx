"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
export function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  return (
    <footer id="footer" className="footer atelier-footer art-footer">
      <div className="art-newsletter">
        <div className="newsletter">
          <p className="eyebrow">Stay in touch</p>
          <h2>
            A world of light,
            <br />
            straight to your inbox.
          </h2>
          {subscribed ? (
            <p className="newsletter-success" role="status">
              Demo complete. Your email has not been saved.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
              }}
            >
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Your email address"
                required
                maxLength={254}
              />
              <button type="submit" aria-label="Join the newsletter demo">
                <ArrowRight size={20} />
              </button>
            </form>
          )}
          <small>A portfolio concept. No emails are collected.</small>
        </div>
      </div>
      <div className="footer-top">
        <div className="footer-brand">
          <Link className="wordmark" href="/" aria-label="Aurelle home">
            AURELLE<span>GOLD JEWELLERY</span>
          </Link>
          <p>Form. Light. Individuality.</p>
        </div>
        <div className="footer-column">
          <h3>Shop</h3>
          <Link href="/collections">All jewellery</Link>
          <Link href="/collections?category=Rings">Rings</Link>
          <Link href="/collections?category=Necklaces">Necklaces</Link>
          <Link href="/collections?category=Earrings">Earrings</Link>
          <Link href="/collections?category=Bracelets">Bracelets</Link>
        </div>
        <div className="footer-column">
          <h3>About</h3>
          <Link href="/#final-edit">Our philosophy</Link>
          <Link href="/#faq">Materials & sizing</Link>
          <Link href="/#lookbook">The lookbook</Link>
          <Link href="/about-demo">
            About this concept <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="footer-column">
          <h3>Support</h3>
          <Link href="/#care">Care guide</Link>
          <Link href="/#faq">FAQs</Link>
          <Link href="/#story">The everyday edit</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} AURELLE. A fictional jewellery concept.
        </p>
        <span>Prices in USD</span>
      </div>
    </footer>
  );
}
