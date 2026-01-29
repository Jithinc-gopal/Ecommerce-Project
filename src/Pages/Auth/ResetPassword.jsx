import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import { toast } from "react-toastify";

export const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post(
        `/accounts/reset-password/${uid}/${token}/`,
        { password }
      );
      toast.success(res.data.message);
      navigate("/Login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Reset Password
        </h2>

        <p className="text-sm text-center text-gray-600 mb-6">
          Enter your new password below.
        </p>

        {/* New Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 text-white font-semibold py-2 rounded-lg transition duration-200
            ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {/* Back to login */}
        <p className="text-sm text-center text-gray-600 mt-6">
          <Link to="/Login" className="text-blue-600 font-medium hover:underline">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
};
