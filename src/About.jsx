import React from "react";
import styles from "./About.module.css";
import { Navbar } from "./Navbar";

export const About = () => {
  return (
    <>
    <Navbar/>
    <section className={styles.about}>
      <div className={styles.container}>
        <h2 className={styles.title}>About Us</h2>
        <p className={styles.subtitle}>
          Your vision, our priority – premium eyewear designed for comfort,
          clarity, and style.
        </p>

        <div className={styles.content}>
          <div className={styles.text}>
            <h3>Who We Are</h3>
            <p>
              At <strong>👓 Eyewear</strong>, we believe glasses are more than
              just a necessity – they’re a style statement. From{" "}
              <em>trendy sunglasses</em> to <em>durable reading glasses</em> and{" "}
              <em>computer-friendly lenses</em>, our mission is to provide
              eyewear that combines fashion with functionality.
            </p>

            <h3>Why Choose Us?</h3>
            <ul>
              <li>✔ Wide collection of frames & lenses</li>
              <li>✔ Affordable prices with premium quality</li>
              <li>✔ 100% UV-protection sunglasses</li>
              <li>✔ Fast delivery & easy returns</li>
            </ul>

            <p>
              We partner with trusted brands and certified lens makers to ensure
              you get the best quality every time you shop with us.
            </p>
          </div>

          <div className={styles.imageBox}>
            <img
              src="https://images.unsplash.com/photo-1511499767150-a48a237f0083"
              alt="Stylish Eyewear"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
    </>
  );
};
