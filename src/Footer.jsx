import React from "react";
import styles from "./Footer.module.css";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand Section */}
        <div className={styles.brand}>
          <h2>VisionX</h2>
          <p>Your trusted eyewear destination. Stylish, durable, and affordable.</p>
        </div>

        {/* Quick Links */}
        <div className={styles.links}>
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/home">Shop</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/faq">FAQs</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className={styles.contact}>
          <h3>Contact</h3>
          <p>Email: EyeWear@gmail.com</p>
          <p>Phone: +91 85907 62676</p>
        </div>

        {/* Social Media */}
        <div className={styles.social}>
          <h3>Follow Us</h3>
          <div className={styles.icons}>
            <a href="https://www.facebook.com/"><FaFacebook /></a>
            <a href="https://www.instagram.com/"><FaInstagram /></a>
            <a href="https://x.com/i/flow/login?lang=en"><FaTwitter /></a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} VisionX. All Rights Reserved.</p>
      </div>
    </footer>
  );
};
