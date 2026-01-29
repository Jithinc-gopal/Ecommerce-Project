import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const Login = () => {
  const navigate = useNavigate();

  const initialValue = { email: "", password: "" };
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isLoged = localStorage.getItem("isLoged") === "true";
    const role = localStorage.getItem("role");

    if (isLoged) {
      navigate(role === "admin" ? "/Admin" : "/Home", { replace: true });
    }
  }, [navigate]);

  const handleInput = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
    if (error[e.target.name]) {
      setError(prev => ({ ...prev, [e.target.name]: "" }));
    }
    if (error.general) {
      setError(prev => ({ ...prev, general: "" }));
    }
  };

  const validation = () => {
    const err = {};
    if (!value.email) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(value.email)) err.email = "Invalid email";

    if (!value.password) err.password = "Password is required";
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validation();
    setError(err);
    if (Object.keys(err).length) return;

    setIsLoading(true);
    try {
      const res = await API.post("/accounts/login/", value);

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("email", res.data.user.email);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("isLoged", "true");

      toast.success("Login successful");
      
      setTimeout(() => {
        navigate(res.data.user.role === "admin" ? "/Admin" : "/Home", {
          replace: true,
        });
      }, 500);
      
    } catch (err) {
      if (err.response?.status === 401) {
        setError({ general: "Invalid email or password" });
      } else if (err.response?.status === 403) {
        setError({ general: "User is inactive" });
        toast.error("User Blocked");
      } else {
        toast.error("Login failed");
      }
    } finally {
      setIsLoading(false);
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
          <p className="text-gray-600">Premium eyewear for perfect vision</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white text-center">
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-indigo-100 mt-1">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={value.email}
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
                  value={value.password}
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

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* General Error */}
            {error.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm text-center">
                  {error.general}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 text-base font-semibold rounded-xl transition-all duration-200 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 active:scale-[0.98]'
              } text-white shadow-lg hover:shadow-xl`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/Registration"
                  className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                >
                  Sign Up
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