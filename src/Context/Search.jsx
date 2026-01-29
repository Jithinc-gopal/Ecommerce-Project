import React, { useState } from 'react'
import { createContext } from 'react'

export const Context  = createContext()
export const Search = ({children}) => {
    const [search,setSearch] = useState('')
       const [cartItems,setCartItems] = useState([])
        const [wishlist,setWishlist] = useState([])

  return (
    <Context.Provider value={{search,setSearch,cartItems,setCartItems,wishlist,setWishlist}}>
        {children}
    </Context.Provider>
  
  )
}
