import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Navbar } from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

export const Myorders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/");
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      await API.patch(`/orders/${orderId}/cancel/`);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: "cancelled" }
            : order
        )
      );
    } catch (error) {
      console.error("Cancel failed", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-green-50 text-green-700 border-green-200";
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (!loading && orders.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              No Orders Yet
            </h2>
            <p className="text-gray-600 mb-8">
              You haven't placed any orders. Start exploring our products!
            </p>
            <button
              onClick={() => navigate("/home")}
              className="inline-flex items-center px-8 py-3.5 text-base font-semibold rounded-xl
                         bg-gradient-to-r from-indigo-600 to-indigo-700 text-white
                         hover:from-indigo-700 hover:to-indigo-800
                         transform transition-all duration-200 hover:-translate-y-0.5
                         shadow-lg hover:shadow-xl"
            >
              Start Shopping
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
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
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium text-gray-700">
            Loading your orders...
          </p>
          <p className="text-gray-500 mt-2">
            Please wait a moment
          </p>
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
                  My Orders
                </h1>
                <p className="text-gray-600 mt-2">
                  Track and manage your orders
                </p>
              </div>
              <button
                onClick={() => navigate("/home")}
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium
                           rounded-xl border-2 border-gray-300 text-gray-700
                           hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                Go to Home
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden
                           hover:shadow-xl transition-all duration-300"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-gray-900">
                          Order 
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Date not available'}
                      </p>
                    </div>
                    
                    {order.status === "pending" && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold
                                   rounded-xl border-2 border-red-500 text-red-600
                                   hover:bg-red-50 hover:border-red-600 hover:text-red-700
                                   active:scale-95 transition-all duration-200"
                      >
                        <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 md:p-6">
                  {order.items.map((item) => (
                    <div 
                      key={item.id}
                      className="flex flex-col md:flex-row gap-6 p-4 md:p-6 rounded-xl bg-gray-50 
                                 border border-gray-200 mb-4 last:mb-0
                                 hover:bg-white hover:border-gray-300 transition-all duration-200"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="relative w-full md:w-40 h-40 rounded-xl overflow-hidden bg-white p-3">
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
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                              {item.product_title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-gray-900">
                                  ₹{item.price}
                                </span>
                                <span className="text-gray-500">×</span>
                                <span className="px-3 py-1 bg-gray-200 rounded-lg text-gray-700 font-medium">
                                  {item.quantity} item{item.quantity > 1 ? 's' : ''}
                                </span>
                              </div>
                              <div className="text-lg font-bold text-gray-900">
                                Total: ₹{item.price * item.quantity}
                              </div>
                            </div>
                            
                            {item.description && (
                              <p className="text-gray-600 mb-4 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Additional actions if needed */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                          <button 
                            onClick={() => navigate(`/product/${item.product_id}`)}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 
                                       flex items-center gap-1 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            View Product
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                {order.total_amount && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-end">
                      <div className="text-right">
                        <span className="text-gray-600">Order Total:</span>
                        <span className="ml-3 text-2xl font-bold text-gray-900">
                          ₹{order.total_amount}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-center sm:text-left">
              Need help with your orders? Contact our support team.
            </p>
            <button
              onClick={() => navigate("/home")}
              className="px-8 py-3 text-base font-semibold rounded-xl
                         bg-gradient-to-r from-gray-900 to-black text-white
                         hover:from-black hover:to-gray-900
                         transform transition-all duration-200 hover:-translate-y-0.5
                         shadow-lg hover:shadow-xl"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
};