import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const Registration = () => {
  const navigate = useNavigate();

  const initialState = {
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  };

  const [formValue, setFormValue] = useState(initialState);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInput = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
    if (error[e.target.name]) {
      setError(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validation = () => {
    const err = {};

    if (!formValue.username || formValue.username.length < 5) {
      err.username = "Username must be at least 5 characters";
    }

    if (!formValue.email) {
      err.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValue.email)) {
      err.email = "Invalid email address";
    }

    if (!formValue.password) {
      err.password = "Password is required";
    } else if (formValue.password.length < 5) {
      err.password = "Password must be at least 5 characters";
    }

    if (formValue.password !== formValue.confirmpassword) {
      err.confirmpassword = "Passwords do not match";
    }

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validation();
    setError(err);
    if (Object.keys(err).length) return;

    setLoading(true);
    try {
      await API.post("/accounts/register/", {
        username: formValue.username,
        email: formValue.email,
        password: formValue.password,
      });

      toast.success("Registration successful. Please login.");
      setFormValue(initialState);
      navigate("/Login");
    } catch (error) {
      if (error.response?.data?.email) {
        setError({ email: error.response.data.email[0] });
      } else {
        toast.error("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 flex items-center justify-center">
              <span className="text-white font-bold text-xl">VX</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">VisionX</h1>
          </div>
          <p className="text-gray-600">Create your account and start shopping</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white text-center">
            <h2 className="text-2xl font-bold">Join VisionX</h2>
            <p className="text-indigo-100 mt-1">Create your free account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formValue.username}
                onChange={handleInput}
                placeholder="Choose a username"
                className={`w-full px-4 py-3.5 text-base rounded-xl border-2 transition-all duration-200 ${
                  error.username 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                } outline-none bg-gray-50`}
              />
              {error.username && (
                <p className="mt-2 text-sm text-red-600">{error.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formValue.email}
                onChange={handleInput}
                placeholder="you@example.com"
                className={`w-full px-4 py-3.5 text-base rounded-xl border-2 transition-all duration-200 ${
                  error.email 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                } outline-none bg-gray-50`}
              />
              {error.email && (
                <p className="mt-2 text-sm text-red-600">{error.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formValue.password}
                  onChange={handleInput}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3.5 text-base rounded-xl border-2 transition-all duration-200 ${
                    error.password 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  } outline-none bg-gray-50 pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                </button>
              </div>
              {error.password && (
                <p className="mt-2 text-sm text-red-600">{error.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmpassword"
                  value={formValue.confirmpassword}
                  onChange={handleInput}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3.5 text-base rounded-xl border-2 transition-all duration-200 ${
                    error.confirmpassword 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  } outline-none bg-gray-50 pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                </button>
              </div>
              {error.confirmpassword && (
                <p className="mt-2 text-sm text-red-600">{error.confirmpassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 text-base font-semibold rounded-xl transition-all duration-200 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 active:scale-[0.98]'
              } text-white shadow-lg hover:shadow-xl`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Sign In Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/Login"
                  className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/home")}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};