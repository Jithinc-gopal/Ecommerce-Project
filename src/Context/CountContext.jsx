import { createContext, useState } from "react";

export const CountContext = createContext();

export const CountProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  return (
    <CountContext.Provider
      value={{
        cartCount,
        setCartCount,
        wishlistCount,
        setWishlistCount,
      }}
    >
      {children}
    </CountContext.Provider>
  );
};
