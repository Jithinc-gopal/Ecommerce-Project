import React, { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import { Navbar } from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { CountContext } from "../../Context/CountContext";

export const Cartview = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setCartCount } = useContext(CountContext);

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart/cart/");
      setCart(res.data);
    } catch {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await API.get("/cart/count/");
      setCartCount(res.data.count);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchCartCount();
  }, []);

  const removeItem = async (id) => {
    try {
      await API.delete(`/cart/cart/item/${id}/`);
      fetchCart();
      fetchCartCount();
    } catch (err) {
      console.error(err);
    }
  };

  const increaseQty = async (productId) => {
    try {
      await API.post("/cart/cart/", { product_id: productId });
      fetchCart();
      fetchCartCount();
    } catch (err) {
      console.error(err);
    }
  };

  const decreaseQty = async (item) => {
    if (item.quantity === 1) return;

    try {
      await API.put(`/cart/cart/item/${item.id}/`, {
        quantity: item.quantity - 1,
      });
      fetchCart();
      fetchCartCount();
    } catch (err) {
      console.error(err);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0
  );

  const discount = totalPrice > 2000 ? 200 : 0;
  const finalAmount = totalPrice - discount;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Cart...</h3>
          <p className="text-gray-500">Fetching your items</p>
        </div>
      </>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet
            </p>
            <button
              onClick={() => navigate("/home")}
              className="inline-flex items-center px-8 py-3.5 text-base font-semibold rounded-xl
                         bg-gradient-to-r from-gray-900 to-black text-white
                         hover:from-black hover:to-gray-900
                         transform transition-all duration-200 hover:-translate-y-0.5
                         shadow-lg hover:shadow-xl"
            >
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              Start Shopping
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Shopping Cart
                </h1>
                <p className="text-gray-600 mt-2">
                  {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
                </p>
              </div>
              <button
                onClick={() => navigate("/home")}
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium
                           rounded-xl border-2 border-gray-300 text-gray-700
                           hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Continue Shopping
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* CART ITEMS SECTION */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Cart Header */}
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Cart Items
                  </h2>
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 hover:bg-gray-50/50 transition-all duration-200"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="relative w-full md:w-48 h-48 rounded-xl overflow-hidden bg-white border border-gray-200 p-4">
                            <img
                              src={item.product_image}
                              alt={item.product_title}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x300?text=Product+Image';
                              }}
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                                  {item.product_title}
                                </h3>
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl font-bold text-gray-900">
                                    ₹{item.product_price}
                                  </span>
                                  <span className="text-gray-500">×</span>
                                  <span className="px-3 py-1 bg-gray-200 rounded-lg text-gray-700 font-medium">
                                    {item.quantity} item{item.quantity > 1 ? 's' : ''}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">
                                  ₹{(item.product_price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
                            {/* Quantity Control */}
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 font-medium mr-3">Quantity:</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => decreaseQty(item)}
                                  disabled={item.quantity === 1}
                                  className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-lg font-semibold transition-all
                                    ${item.quantity === 1
                                      ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                                      : "border-gray-300 text-gray-700 hover:bg-gray-100 active:scale-95"
                                    }`}
                                >
                                  −
                                </button>

                                <span className="min-w-[40px] text-center text-lg font-semibold text-gray-900">
                                  {item.quantity}
                                </span>

                                <button
                                  onClick={() => increaseQty(item.product)}
                                  className="w-10 h-10 rounded-xl border-2 border-gray-300 flex items-center justify-center text-lg font-semibold
                                             text-gray-700 hover:bg-gray-100 active:scale-95 transition-all"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeItem(item.id)}
                              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold
                                         rounded-xl border-2 border-red-500 text-red-600
                                         hover:bg-red-50 hover:border-red-600 hover:text-red-700
                                         active:scale-95 transition-all duration-200"
                            >
                              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                              Remove Item
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ORDER SUMMARY SECTION */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  {/* Summary Header */}
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Order Summary
                    </h2>
                  </div>

                  {/* Summary Details */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {/* Items Total */}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-lg font-semibold text-gray-900">
                          ₹{totalPrice.toFixed(2)}
                        </span>
                      </div>

                      {/* Discount */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Discount</span>
                          {discount > 0 && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Applied
                            </span>
                          )}
                        </div>
                        <span className="text-lg font-semibold text-green-600">
                          - ₹{discount.toFixed(2)}
                        </span>
                      </div>

                      {/* Delivery */}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Delivery</span>
                        <span className="text-lg font-semibold text-gray-900">
                          {finalAmount > 500 ? "FREE" : "₹50.00"}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">Total</span>
                          <div className="text-right">
                            <p className="text-2xl md:text-3xl font-bold text-gray-900">
                              ₹{finalAmount.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {totalItems} item{totalItems !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Info Message */}
                      {discount === 0 && totalPrice > 0 && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7z" clipRule="evenodd" />
                            </svg>
                            Add ₹{(2000 - totalPrice).toFixed(2)} more to get ₹200 off
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={() => navigate("/OrderForm")}
                      className="w-full mt-8 py-4 text-lg font-semibold rounded-xl
                                 bg-gradient-to-r from-gray-900 to-black text-white
                                 hover:from-black hover:to-gray-900
                                 transform transition-all duration-200 hover:-translate-y-0.5
                                 shadow-lg hover:shadow-xl active:scale-95"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        Proceed to Checkout
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};