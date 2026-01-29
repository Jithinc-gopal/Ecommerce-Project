import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { 
  FaHeart, 
  FaShoppingCart, 
  FaStar, 
  FaChevronLeft,
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaEye,
  FaCheck,
  FaUser,
  FaCalendarAlt,
  FaPlus,
  FaMinus,
  FaBoxOpen,
  FaClock
} from "react-icons/fa";
import API from "../../api/axios";
import { CountContext } from "../../Context/CountContext";
import { toast } from "react-toastify";

export const Productdetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setCartCount, setWishlistCount } = useContext(CountContext);

  const token = localStorage.getItem("access");

  // Main product states
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Cart and wishlist states
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);
  
  // Review eligibility states
  const [reviewEligibility, setReviewEligibility] = useState({
    can_review: false,
    has_purchased: false,
    has_reviewed: false,
    is_delivered: false,
    order_item_id: null,
    order_id: null
  });
  const [eligibilityLoading, setEligibilityLoading] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/products/products/${id}/`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await API.get(`products/products/${id}/reviews/`);
        console.log("data",response.data)
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        // Don't show error toast for reviews to avoid spamming
      }
    };

    if (product) {
      fetchReviews();
    }
  }, [id, product]);

  // Fetch cart items
  useEffect(() => {
    if (!token) return;

    const fetchCart = async () => {
      try {
        const response = await API.get("/cart/cart/");
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [token]);

  // Fetch wishlist items
  useEffect(() => {
    if (!token) return;

    const fetchWishlist = async () => {
      try {
        const response = await API.get("/wishlist/wishlist/");
        setWishlistItems(response.data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, [token]);

  // Check review eligibility
  useEffect(() => {
    const checkReviewEligibility = async () => {
      if (!token || !product) return;
      
      setEligibilityLoading(true);
      try {
        const response = await API.get(`/products/products/${id}/can-review/`);
        setReviewEligibility(response.data);
      } catch (error) {
        console.error("Error checking review eligibility:", error);
        // Don't show toast for eligibility check failures
      } finally {
        setEligibilityLoading(false);
      }
    };
    
    if (product) {
      checkReviewEligibility();
    }
  }, [id, product, token]);

  // Check if product is in cart
  const isInCart = cartItems.some(item => item.product === parseInt(id));

  // Check if product is in wishlist
  const isInWishlist = wishlistItems.some(item => item.product.id === parseInt(id));

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    if (!token) {
      toast.error("Please login to add to wishlist");
      navigate("/login");
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        await API.delete("/wishlist/wishlist/", {
          data: { product_id: id }
        });
        setWishlistItems(prev => prev.filter(item => item.product.id !== parseInt(id)));
        toast.success("Removed from wishlist");
        
        // Update wishlist count
        const countResponse = await API.get("/wishlist/count/");
        setWishlistCount(countResponse.data.count);
      } else {
        // Add to wishlist
        await API.post("/wishlist/wishlist/", {
          product_id: id
        });
        
        // Fetch updated wishlist
        const response = await API.get("/wishlist/wishlist/");
        setWishlistItems(response.data);
        toast.success("Added to wishlist!");
        
        // Update wishlist count
        const countResponse = await API.get("/wishlist/count/");
        setWishlistCount(countResponse.data.count);
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error(error.response?.data?.detail || "Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!token) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }

    setCartLoading(true);
    try {
      for (let i = 0; i < quantity; i++) {
        await API.post("/cart/cart/", {
          product_id: id
        });
      }

      toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart!`);
      
      // Update cart items
      const response = await API.get("/cart/cart/");
      setCartItems(response.data);
      
      // Update cart count
      const countResponse = await API.get("/cart/count/");
      setCartCount(countResponse.data.count);
      
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(error.response?.data?.detail || "Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  // Handle buy now
  const handleBuyNow = async () => {
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    setCartLoading(true);
    try {
      for (let i = 0; i < quantity; i++) {
        await API.post("/cart/cart/", {
          product_id: id
        });
      }

      // Update cart count
      const countResponse = await API.get("/cart/count/");
      setCartCount(countResponse.data.count);
      
      // Navigate to checkout
      navigate("/OrderForm");
    } catch (error) {
      console.error("Buy now error:", error);
      toast.error(error.response?.data?.detail || "Failed to process order");
    } finally {
      setCartLoading(false);
    }
  };

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Please login to submit a review");
      navigate("/login");
      return;
    }

    if (!reviewEligibility.can_review) {
      if (reviewEligibility.has_purchased && !reviewEligibility.is_delivered) {
        toast.error("Your order hasn't been delivered yet. You can review once it's delivered.");
      } else {
        toast.error("You need to purchase and receive this product before reviewing");
      }
      return;
    }

    if (reviewEligibility.has_reviewed) {
      toast.error("You've already reviewed this product");
      return;
    }

    if (reviewText.trim().length < 10) {
      toast.error("Review must be at least 10 characters");
      return;
    }

    setReviewLoading(true);
    try {
      const reviewData = {
        rating: reviewRating,
        comment: reviewText.trim(),
      };
      
      // Add order_item_id if available
      if (reviewEligibility.order_item_id) {
        reviewData.order_item = reviewEligibility.order_item_id;
      }

      const response = await API.post(`products/products/${id}/reviews/`, reviewData);

      toast.success("Review submitted successfully!");
      
      // Add new review to reviews list
      setReviews(prev => [response.data, ...prev]);
      
      // Update eligibility
      setReviewEligibility(prev => ({
        ...prev,
        can_review: false,
        has_reviewed: true
      }));
      
      // Clear form
      setReviewText("");
      setReviewRating(5);
      
    } catch (error) {
      console.error("Review submission error:", error);
      const errorMsg = error.response?.data?.detail || "Failed to submit review";
      
      // Handle specific error cases
      if (error.response?.status === 403) {
        toast.error("You must purchase and receive this product before reviewing");
      } else if (error.response?.status === 400 && error.response?.data?.detail?.includes("already reviewed")) {
        toast.error("You have already reviewed this product");
        setReviewEligibility(prev => ({
          ...prev,
          can_review: false,
          has_reviewed: true
        }));
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setReviewLoading(false);
    }
  };

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  // Product features
  const productFeatures = [
    { icon: <FaShieldAlt className="w-5 h-5" />, text: "2-Year Warranty" },
    { icon: <FaTruck className="w-5 h-5" />, text: "Free Shipping Over ₹2000" },
    { icon: <FaUndo className="w-5 h-5" />, text: "30-Day Return Policy" },
    { icon: <FaEye className="w-5 h-5" />, text: "100% UV Protection" }
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Loading product details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <FaEye className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate("/home")}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200"
            >
              Browse Products
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group"
          >
            <FaChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </button>

          {/* Main Product Section */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-6">
              <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden group">
                <img
                  src={product.image || "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                  alt={product.title}
                  className="w-full h-[400px] md:h-[500px] object-contain p-8"
                />
                
                {/* Wishlist Button */}
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {wishlistLoading ? (
                    <svg className="w-5 h-5 text-indigo-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                  ) : (
                    <FaHeart
                      className={`w-6 h-6 transition-all duration-300 ${
                        isInWishlist
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    />
                  )}
                </button>

               
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {product.title}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(averageRating)
                            ? "text-amber-500 fill-amber-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-gray-600 font-medium">
                      {averageRating} • {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl md:text-5xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ₹{product.original_price}
                      </span>
                      <span className="px-3 py-1 bg-red-100 text-red-700 font-semibold rounded-full text-sm">
                        Save ₹{product.original_price - product.price}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-gray-600">Inclusive of all taxes</p>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Description</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description || "Premium eyewear designed for comfort, style, and optimal vision protection."}
                </p>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                {isInCart ? (
                  <button
                    onClick={() => navigate("/cart")}
                    className="flex-1 flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <FaCheck className="w-5 h-5" />
                    Added to Cart • View Cart
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={cartLoading}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 ${
                      cartLoading
                        ? 'bg-gray-400 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 hover:scale-[1.02]'
                    }`}
                  >
                    {cartLoading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        Adding...
                      </>
                    ) : (
                      <>
                        <FaShoppingCart className="w-5 h-5" />
                        Add to Cart • ₹{(product.price * quantity).toFixed(2)}
                      </>
                    )}
                  </button>
                )}

               
              </div>

             
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Customer Reviews ({reviews.length})
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-gray-900">{averageRating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(averageRating)
                              ? "text-amber-500 fill-amber-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {reviews.length > 0 && (
                    <div className="text-sm text-gray-600">
                      Based on verified purchases
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <FaStar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      No Reviews Yet
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Be the first verified customer to share your thoughts about this product!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                              <FaUser className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {review.user_name || "Anonymous"}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <FaCalendarAlt className="w-3 h-3" />
                                {new Date(review.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`w-5 h-5 ${
                                  i < review.rating
                                    ? "text-amber-500 fill-amber-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                        {review.order_info && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <FaCheck className="w-4 h-4 text-green-500" />
                              <span>Verified Purchase • Order #{review.order_info.order_id}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Review Form */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Add Your Review
                  </h3>
                  
                  {eligibilityLoading ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-gray-600">Checking review eligibility...</p>
                    </div>
                  ) : !token ? (
                    <div className="text-center py-6 bg-gray-50 rounded-xl">
                      <FaUser className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-700 mb-4">
                        Please login to leave a review
                      </p>
                      <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                      >
                        Login
                      </button>
                    </div>
                  ) : reviewEligibility.has_reviewed ? (
                    <div className="text-center py-6 bg-green-50 rounded-xl border border-green-200">
                      <FaCheck className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <p className="text-gray-700 font-medium">
                        You've already reviewed this product
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        Thank you for your feedback!
                      </p>
                      {reviewEligibility.order_id && (
                        <p className="text-gray-500 text-xs mt-2">
                          Reviewed from Order #{reviewEligibility.order_id}
                        </p>
                      )}
                    </div>
                  ) : reviewEligibility.has_purchased && !reviewEligibility.is_delivered ? (
                    <div className="text-center py-6 bg-yellow-50 rounded-xl border border-yellow-200">
                      <FaTruck className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                      <p className="text-gray-700 font-medium mb-2">
                        Your order is on the way!
                      </p>
                      <p className="text-gray-600 text-sm mb-4">
                        You can review this product once it's delivered.
                      </p>
                      {reviewEligibility.order_id && (
                        <div className="flex items-center justify-center gap-2 text-sm text-yellow-700">
                          <FaClock className="w-4 h-4" />
                          <span>Order #{reviewEligibility.order_id} is being processed.</span>
                        </div>
                      )}
                      <button
                        onClick={() => navigate("/orders")}
                        className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all"
                      >
                        View My Orders
                      </button>
                    </div>
                  ) : reviewEligibility.can_review ? (
                    <>
                      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-3">
                          <FaCheck className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-800">You can review this product!</p>
                            <p className="text-sm text-blue-600">
                              You purchased this item in Order #{reviewEligibility.order_id}
                            </p>
                          </div>
                        </div>
                      </div>
                      <form onSubmit={handleSubmitReview} className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Your Rating
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                                  star <= reviewRating
                                    ? 'bg-amber-100 text-amber-600'
                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                }`}
                              >
                                <FaStar className="w-6 h-6" />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Your Review
                          </label>
                          <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="w-full px-4 py-3.5 text-base rounded-xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-gray-50 resize-none"
                            placeholder="Share your experience with this product..."
                            rows="4"
                            required
                            minLength="10"
                          />
                          <div className="flex justify-between mt-2">
                            <p className="text-sm text-gray-500">
                              Minimum 10 characters
                            </p>
                            <p className="text-sm text-gray-500">
                              {reviewText.length}/500
                            </p>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={reviewLoading || reviewText.length < 10}
                          className={`px-8 py-3.5 font-semibold rounded-xl transition-all duration-200 ${
                            reviewLoading || reviewText.length < 10
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 hover:scale-[1.02] active:scale-95'
                          } shadow-lg hover:shadow-xl`}
                        >
                          {reviewLoading ? (
                            <div className="flex items-center justify-center gap-2">
                              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                              </svg>
                              Submitting...
                            </div>
                          ) : 'Submit Review'}
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="text-center py-6 bg-amber-50 rounded-xl border border-amber-200">
                      <FaShoppingCart className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                      <p className="text-gray-700 font-medium mb-2">
                        Purchase this product to leave a review
                      </p>
                      <p className="text-gray-600 text-sm mb-4">
                        Only customers who have purchased and received this product can leave reviews
                      </p>
                      <button
                        onClick={() => navigate("/home")}
                        className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all"
                      >
                        Browse Products
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};