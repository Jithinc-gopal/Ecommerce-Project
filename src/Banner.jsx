import React, { useEffect, useState } from "react";
import styles from "./Banner.module.css";

const images = [
   "https://i.pinimg.com/1200x/0c/5e/4f/0c5e4fe4144a4515fe0be24b86c380b1.jpg",
  "https://i.pinimg.com/1200x/68/22/dd/6822dd113162930dccc1b821d50d0802.jpg",
  "https://i.pinimg.com/1200x/cd/a5/c3/cda5c310d9b128523a4da9740ddf1b84.jpg",
 
];

export const Banner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.bannerContainer}>
      <div
        className={styles.banner}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((img, i) => (
          <img key={i} src={img} alt={`banner-${i}`} />
        ))}
      </div>

      <div className={styles.overlay}>
     "Discover the perfect eyewear – Style, Comfort & Clarity in every frame."
      </div>
    </div>
  );
};
