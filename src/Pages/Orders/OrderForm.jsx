import React, { useState } from "react";
import API from "../../api/axios";
import { Navbar } from "../../components/Navbar/Navbar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const OrderForm = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    pincode: "",
    city: "",
    state: "",
    street_address: "",
    payment_method: "cash on delivery",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "full_name" || name === "street_address"
          ? value.trimStart()
          : value,
    }));
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const fetchLocationFromPincode = async (pincode) => {
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setFormData((prev) => ({ ...prev, city: "", state: "" }));
      return;
    }

    try {
      setLoadingLocation(true);
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await res.json();

      if (data[0]?.Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        setFormData((prev) => ({
          ...prev,
          city: postOffice.District,
          state: postOffice.State,
        }));
        toast.success("City & State auto-filled successfully");
      } else {
        toast.error("Invalid pincode or not found");
      }
    } catch {
      toast.error("Failed to fetch location details");
    } finally {
      setLoadingLocation(false);
    }
  };

  const fetchAddressSuggestions = async (query) => {
    if (query.length < 3 || !formData.city) {
      setAddressSuggestions([]);
      return;
    }

    try {
      const searchQuery = `${query}, ${formData.city}, ${formData.state}, India`;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
          searchQuery
        )}`,
        { headers: { "User-Agent": "checkout-app" } }
      );
      const data = await res.json();
      setAddressSuggestions(data);
      setShowSuggestions(true);
    } catch {}
  };

  const validate = () => {
    const err = {};
    if (!formData.full_name || formData.full_name.length < 5)
      err.full_name = "Full name must be at least 5 characters";
    if (!/^[6-9]\d{9}$/.test(formData.phone_number))
      err.phone_number = "Enter a valid 10-digit phone number";
    if (!/^[1-9][0-9]{5}$/.test(formData.pincode))
      err.pincode = "Enter a valid 6-digit pincode";
    if (!formData.city) err.city = "City is required";
    if (!formData.state) err.state = "State is required";
    if (!formData.street_address) err.street_address = "Address is required";
    if (formData.street_address.length < 10) 
      err.street_address = "Please provide a complete address";
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setIsSubmitting(true);
      await API.post("/orders/", formData);
      toast.success("🎉 Order placed successfully!");
      setTimeout(() => {
        navigate("/MyOrders");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Form Header */}
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Shipping Details
                      </h2>
                      <p className="text-gray-600 mt-2">
                        Please fill in your delivery information
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8">
                  <div className="space-y-6">
                    {/* Name and Phone Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="full_name"
                            placeholder="Enter your full name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className={`w-full px-4 py-3.5 text-base rounded-xl border-2 transition-all duration-200
                                       ${errors.full_name 
                                         ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                         : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                                       } outline-none`}
                          />
                          <div className="absolute right-3 top-3.5">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                          </div>
                        </div>
                        {errors.full_name && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.full_name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="phone_number"
                            placeholder="Enter 10-digit number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className={`w-full px-4 py-3.5 text-base rounded-xl border-2 transition-all duration-200
                                       ${errors.phone_number 
                                         ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                         : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                                       } outline-none`}
                          />
                          <div className="absolute right-3 top-3.5">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                          </div>
                        </div>
                        {errors.phone_number && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.phone_number}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Pincode */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="pincode"
                          placeholder="Enter 6-digit pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          onBlur={() => fetchLocationFromPincode(formData.pincode)}
                          className={`w-full px-4 py-3.5 text-base rounded-xl border-2 transition-all duration-200
                                     ${errors.pincode 
                                       ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                       : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                                     } outline-none`}
                        />
                        <div className="absolute right-3 top-3.5">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                        </div>
                      </div>
                      {loadingLocation && (
                        <p className="mt-2 text-sm text-indigo-600 flex items-center gap-2">
                          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                          </svg>
                          Fetching location details...
                        </p>
                      )}
                      {errors.pincode && (
                        <p className="mt-2 text-sm text-red-600">{errors.pincode}</p>
                      )}
                    </div>

                    {/* City & State - Auto-filled */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <div className="relative">
                          <input
                            disabled
                            value={formData.city}
                            placeholder="Auto-filled from pincode"
                            className="w-full px-4 py-3.5 text-base rounded-xl border-2 border-gray-300 bg-gray-50 text-gray-700"
                          />
                          <div className="absolute right-3 top-3.5">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <div className="relative">
                          <input
                            disabled
                            value={formData.state}
                            placeholder="Auto-filled from pincode"
                            className="w-full px-4 py-3.5 text-base rounded-xl border-2 border-gray-300 bg-gray-50 text-gray-700"
                          />
                          <div className="absolute right-3 top-3.5">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Complete Address *
                      </label>
                      <div className="relative">
                        <textarea
                          rows={4}
                          name="street_address"
                          placeholder="House no., Street, Area, Landmark"
                          value={formData.street_address}
                          onChange={(e) => {
                            handleChange(e);
                            fetchAddressSuggestions(e.target.value);
                          }}
                          onFocus={() => setShowSuggestions(true)}
                          className={`w-full px-4 py-3.5 text-base rounded-xl border-2 transition-all duration-200 resize-none
                                     ${errors.street_address 
                                       ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                       : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                                     } outline-none`}
                        />
                      </div>
                      
                      {/* Address Suggestions */}
                      {showSuggestions && addressSuggestions.length > 0 && (
                        <div className="mt-2 border border-gray-300 rounded-xl shadow-lg overflow-hidden">
                          <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
                            <p className="text-sm font-medium text-gray-700">Address Suggestions</p>
                          </div>
                          <ul className="max-h-48 overflow-auto">
                            {addressSuggestions.map((item) => (
                              <li
                                key={item.place_id}
                                className="px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    street_address: item.display_name,
                                  }));
                                  setShowSuggestions(false);
                                  setAddressSuggestions([]);
                                }}
                              >
                                <div className="flex items-start gap-3">
                                  <svg className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                  </svg>
                                  <span className="flex-1">{item.display_name}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {errors.street_address && (
                        <p className="mt-2 text-sm text-red-600">{errors.street_address}</p>
                      )}
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Payment Method *
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {["cash on delivery", "upi", "card"].map((method) => (
                          <div
                            key={method}
                            className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all duration-200
                                       ${formData.payment_method === method
                                         ? 'border-indigo-500 bg-indigo-50'
                                         : 'border-gray-300 hover:border-gray-400'
                                       }`}
                            onClick={() => setFormData(prev => ({ ...prev, payment_method: method }))}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                              ${formData.payment_method === method 
                                                ? 'border-indigo-500 bg-indigo-500' 
                                                : 'border-gray-400'
                                              }`}>
                                {formData.payment_method === method && (
                                  <div className="w-2 h-2 rounded-full bg-white"></div>
                                )}
                              </div>
                              <span className="font-medium capitalize">
                                {method === "cash on delivery" ? "Cash on Delivery" : 
                                 method === "upi" ? "UPI" : "Card"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-200
                                 ${isSubmitting 
                                   ? 'bg-gray-400 cursor-not-allowed' 
                                   : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 active:scale-[0.98]'
                                 } text-white shadow-lg hover:shadow-xl`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-3">
                          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                          </svg>
                          Processing Order...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Place Order
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column - Summary & Info */}
            <div className="md:col-span-1">
              <div className="sticky top-8 space-y-6">
               

                {/* Support Card */}
                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-2xl border border-indigo-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Our support team is here to help you with any questions about your order.
                  </p>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <span className="font-medium text-gray-900">859-0762-667</span>
                  </div>
                </div>

                {/* Back Button */}
                <button
                  onClick={() => navigate(-1)}
                  className="w-full py-3.5 text-base font-medium rounded-xl border-2 border-gray-300 text-gray-700
                           hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  Back to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};