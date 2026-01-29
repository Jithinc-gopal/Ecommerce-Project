import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaEye, FaCheck } from "react-icons/fa";
import API from "../../api/axios";
import { Context as SearchContext } from "../../Context/Search";
import { CountContext } from "../../Context/CountContext";

export const Products = () => {
  const navigate = useNavigate();
  const { search } = useContext(SearchContext);
  const { setCartCount, setWishlistCount } = useContext(CountContext);

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access");

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products/products/");
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= FETCH CART ================= */
  useEffect(() => {
    if (!token) return;

    const fetchCart = async () => {
      try {
        const cartRes = await API.get("/cart/cart/");
        setCartItems(cartRes.data);

        const countRes = await API.get("/cart/count/");
        setCartCount(countRes.data.count);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };

    fetchCart();
  }, [token, setCartCount]);

  /* ================= FETCH WISHLIST ================= */
  useEffect(() => {
    if (!token) return;

    const fetchWishlist = async () => {
      try {
        const listRes = await API.get("/wishlist/wishlist/");
        setWishlist(listRes.data);

        const countRes = await API.get("/wishlist/count/");
        setWishlistCount(countRes.data.count);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };

    fetchWishlist();
  }, [token, setWishlistCount]);

  /* ================= HELPERS ================= */
  const isInCart = (id) =>
    cartItems.some((item) => item.product === id);

  const isWishlisted = (id) =>
    wishlist.some((item) => item.product.id === id);

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async (id, e) => {
    e.stopPropagation();
    
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await API.post("/cart/cart/", { product_id: id });

      const cartRes = await API.get("/cart/cart/");
      setCartItems(cartRes.data);

      const countRes = await API.get("/cart/count/");
      setCartCount(countRes.data.count);

      // Visual feedback
      e.target.textContent = "Added!";
      setTimeout(() => {
        if (e.target) {
          e.target.textContent = "Go to Cart";
        }
      }, 1500);
    } catch {
      navigate("/login");
    }
  };

  /* ================= WISHLIST TOGGLE ================= */
  const handleWishlist = async (productId, e) => {
    e.stopPropagation();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      if (isWishlisted(productId)) {
        await API.delete("/wishlist/wishlist/", {
          data: { product_id: productId },
        });
      } else {
        await API.post("/wishlist/wishlist/", {
          product_id: productId,
        });
      }

      const listRes = await API.get("/wishlist/wishlist/");
      setWishlist(listRes.data);

      const countRes = await API.get("/wishlist/count/");
      setWishlistCount(countRes.data.count);
    } catch (err) {
      console.error("Wishlist toggle failed", err);
    }
  };

  const filteredProducts = products.filter((p) =>
    search === ""
      ? p
      : p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-4 animate-pulse">
            <div className="w-full h-64 bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Results Counter */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Premium Eyewear Collection
        </h2>
        <p className="text-gray-600">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          {search && ` for "${search}"`}
        </p>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-8">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={() => navigate("/home")}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200"
            >
              Browse All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => navigate(`/productdetails/${product.id}`)}
              >
                {/* Product Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => handleWishlist(product.id, e)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200"
                    aria-label={isWishlisted(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <FaHeart
                      className={`w-5 h-5 transition-all duration-300 ${
                        isWishlisted(product.id)
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    />
                  </button>
                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/productdetails/${product.id}`);
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
                    >
                      <FaEye className="w-4 h-4" />
                      Quick View
                    </button>
                  </div>
                </div>
                {/* Product Content */}
                <div className="p-5">
                  {/* Product Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {product.title}
                  </h3>

                  {/* Product Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{product.price}
                      </span>
                      {product.original_price && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          ₹{product.original_price}
                        </span>
                      )}
                    </div>
                    {product.rating && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
                        <span className="text-sm font-semibold text-gray-900">
                          {product.rating}
                        </span>
                        <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Features List */}
                  {product.features && (
                    <ul className="mb-4 space-y-1">
                      {product.features.slice(0, 2).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isInCart(product.id)) {
                          navigate("/cart");
                        } else {
                          handleAddToCart(product.id, e);
                        }
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        isInCart(product.id)
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800"
                      } hover:scale-[1.02] active:scale-95`}
                    >
                      {isInCart(product.id) ? (
                        <>
                          <FaCheck className="w-4 h-4" />
                          In Cart
                        </>
                      ) : (
                        <>
                          <FaShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </>
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/productdetails/${product.id}`);
                      }}
                      className="px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                    >
                      Details
                    </button>
                  </div>
                </div>

                {/* Product Type Badge */}
                {product.type && (
                  <div className="absolute -top-3 left-5">
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
                      {product.type}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Load More Button (Optional) */}
      {filteredProducts.length > 0 && (
        <div className="max-w-7xl mx-auto mt-12 text-center">
          <button
            onClick={() => navigate("/home")}
            className="px-8 py-3.5 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
          >
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
};