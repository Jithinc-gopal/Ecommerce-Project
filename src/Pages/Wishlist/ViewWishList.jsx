import React, { useEffect, useState, useContext } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { 
  FaTrash, 
  FaHeart, 
  FaShoppingCart, 
  FaEye, 
  FaCheck,
  FaArrowRight,
  FaRegHeart,
  FaStar
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { CountContext } from "../../Context/CountContext";
import { Context as SearchContext } from "../../Context/Search";

export const ViewWishList = () => {
  const [wishlist, setWishlist] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { setWishlistCount } = useContext(CountContext);
  const { search } = useContext(SearchContext);

  const token = localStorage.getItem("access");

  /* ================= FETCH WISHLIST ================= */
  const fetchWishlist = async () => {
    try {
      const listRes = await API.get("/wishlist/wishlist/");
      setWishlist(listRes.data);

      const countRes = await API.get("/wishlist/count/");
      setWishlistCount(countRes.data.count);
    } catch (err) {
      console.error("Wishlist fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH CART ITEMS ================= */
  const fetchCartItems = async () => {
    try {
      const cartRes = await API.get("/cart/cart/");
      setCartItems(cartRes.data);
    } catch (err) {
      console.error("Cart fetch error", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWishlist();
      fetchCartItems();
    } else {
      setLoading(false);
    }
  }, [token]);

  /* ================= REMOVE FROM WISHLIST ================= */
  const handleDelete = async (productId, e) => {
    e.stopPropagation();
    try {
      await API.delete("/wishlist/wishlist/", {
        data: { product_id: productId },
      });

      fetchWishlist(); // ✅ re-sync list + count
    } catch (error) {
      console.error("Wishlist delete failed", error);
    }
  };

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
    
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await API.post("/cart/cart/", {
        product_id: productId,
      });

      await fetchCartItems();
      
      // Visual feedback
      const button = e.target;
      button.textContent = "Added!";
      setTimeout(() => {
        if (button) {
          button.textContent = "Go to Cart";
        }
      }, 1500);
    } catch (error) {
      console.error("Add to cart failed", error);
      navigate("/login");
    }
  };

  const filteredWishlist = wishlist.filter(item =>
    search === ""
      ? item
      : item.product.title.toLowerCase().includes(search.toLowerCase())
  );

  if (!token) {
    return (
      <>
        <Navbar />
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <FaRegHeart className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Please Login
            </h2>
            <p className="text-gray-600 mb-8">
              You need to be logged in to view your wishlist
            </p>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200"
            >
              Login to Continue
            </button>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
          {/* Loading Header */}
          <div className="pt-24 pb-8 px-4 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          
          {/* Loading Wishlist Grid */}
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm p-4 animate-pulse">
                  <div className="w-full h-64 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (filteredWishlist.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
          {/* Empty State */}
          <div className="pt-24 pb-16 px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
                <FaHeart className="w-16 h-16 text-red-300" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Your Wishlist is Empty
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
                {search ? `No wishlist items found for "${search}"` : "Start adding items you love to your wishlist!"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/home")}
                  className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200"
                >
                  Start Shopping
                </button>
                {search && (
                  <button
                    onClick={() => navigate("/home")}
                    className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Wishlist Header */}
        <div className="pt-24 pb-16 px-4 bg-gradient-to-r from-red-900/10 via-pink-900/10 to-rose-900/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                  My Wishlist
                </h1>
                <p className="text-gray-600">
                  {filteredWishlist.length} item{filteredWishlist.length !== 1 ? 's' : ''} saved for later
                  {search && ` • Searching for "${search}"`}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/home")}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                >
                  Continue Shopping
                  <FaArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWishlist.map((item) => {
              const product = item.product;
              const inCart = cartItems.some(
                (cartItem) => cartItem.product === product.id
              );

              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate(`/productdetails/${product.id}`)}
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-64 object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    
                    {/* Wishlist Remove Button */}
                    <button
                      onClick={(e) => handleDelete(product.id, e)}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200"
                      aria-label="Remove from wishlist"
                    >
                      <FaTrash className="w-5 h-5 text-red-500 hover:text-red-600" />
                    </button>

                    {/* Wishlist Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1">
                        <FaHeart className="w-3 h-3" />
                        Wishlisted
                      </span>
                    </div>

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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
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
                          <FaStar className="w-4 h-4 text-amber-500 fill-current" />
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (inCart) {
                            navigate("/cart");
                          } else {
                            handleAddToCart(product.id, e);
                          }
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-200 ${
                          inCart
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                        } hover:scale-[1.02] active:scale-95`}
                      >
                        {inCart ? (
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
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Wishlist Actions */}
          {filteredWishlist.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                  <p className="text-gray-700 font-medium">
                    Found {filteredWishlist.length} items in your wishlist
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Items will remain in your wishlist until you remove them
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate("/home")}
                    className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => navigate("/cart")}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200"
                  >
                    View Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wishlist Tips */}
        {filteredWishlist.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 pb-12">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Why Save to Wishlist?
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                      </div>
                      <span className="text-gray-700">Save items you love for later purchase</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                      </div>
                      <span className="text-gray-700">Get notified when items go on sale</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                      </div>
                      <span className="text-gray-700">Compare styles and make better decisions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                      </div>
                      <span className="text-gray-700">Create inspiration boards for future purchases</span>
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <FaHeart className="w-24 h-24 text-red-300 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Your wishlist helps you organize and prioritize your favorite eyewear picks
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};