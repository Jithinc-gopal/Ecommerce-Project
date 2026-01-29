import React, { useEffect, useState } from "react";
import {
    FaUserCircle,
    FaEdit,
    FaSignOutAlt,
    FaPhone,
    FaEnvelope,
    FaSave,
    FaTimes,
    FaCamera,
    FaUser,
    FaShieldAlt,
    FaHistory,
    FaMapMarkerAlt,
    FaBirthdayCake,
    FaCalendarAlt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import API from "../../api/axios";

const BACKEND_URL = "http://127.0.0.1:8000";

const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith("http")) return image;
    return `${BACKEND_URL}${image}`;
};

const Profile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [preview, setPreview] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");

    const [formData, setFormData] = useState({
        username: "",
        phone_number: "",
        image: null,
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await API.get("/accounts/profile/");
            setUser(res.data);

            setFormData({
                username: res.data.username || "",
                phone_number: res.data.phone_number || "",
                image: null,
            });

            setPreview(getImageUrl(res.data.image));
        } catch (err) {
            console.error("Profile fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image" && files && files[0]) {
            setFormData((prev) => ({ ...prev, image: files[0] }));
            setPreview(URL.createObjectURL(files[0]));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleUpdate = async () => {
        try {
            const data = new FormData();
            data.append("username", formData.username);
            data.append("phone_number", formData.phone_number);

            if (formData.image) {
                data.append("image", formData.image);
            }

            const res = await API.patch("/accounts/profile/", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setUser(res.data);
            setPreview(getImageUrl(res.data.image));
            setEditMode(false);
        } catch (err) {
            console.error("Profile update error:", err);
        }
    };

    const handleLogout = async () => {
        const refresh = localStorage.getItem("refresh");
        try {
            if (refresh) {
                await API.post("/accounts/logout/", { refresh });
            }
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            localStorage.clear();
            navigate("/Login", { replace: true });
        }
    };

    const stats = [
        { label: "Total Orders", value: user?.total_orders|| "0", icon: <FaHistory className="w-5 h-5" /> },
        { label: "Member Since", value: "2024", icon: <FaCalendarAlt className="w-5 h-5" /> },
        { label: "Account Type", value: "Premium", icon: <FaShieldAlt className="w-5 h-5" /> },
    ];

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Profile</h3>
                    <p className="text-gray-600">Fetching your details...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            My Profile
                        </h1>
                        <p className="text-gray-600">
                            Manage your personal information and account settings
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                {/* Profile Header */}
                                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
                                    <div className="flex flex-col items-center text-center">
                                        {/* Profile Image */}
                                        <div className="relative mb-4">
                                            <div className="w-32 h-32 rounded-full border-4 border-white/30 overflow-hidden bg-white">
                                                {preview ? (
                                                    <img
                                                        src={preview}
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                                                        <FaUserCircle className="w-24 h-24 text-indigo-400" />
                                                    </div>
                                                )}
                                                
                                                {editMode && (
                                                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                                        <FaCamera className="w-5 h-5 text-indigo-600" />
                                                        <input
                                                            type="file"
                                                            name="image"
                                                            accept="image/*"
                                                            onChange={handleChange}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </div>

                                        {/* Username */}
                                        {editMode ? (
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 text-lg font-semibold bg-white/20 backdrop-blur-sm rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                                                placeholder="Enter username"
                                            />
                                        ) : (
                                            <h2 className="text-2xl font-bold mb-1">
                                                {user.username}
                                            </h2>
                                        )}

                                        <p className="text-indigo-100 text-sm">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="p-6">
                                

                                    {/* Action Buttons */}
                                    <div className="space-y-3">
                                        {editMode ? (
                                            <>
                                                <button
                                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white py-3.5 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 active:scale-95"
                                                    onClick={handleUpdate}
                                                >
                                                    <FaSave className="w-5 h-5" />
                                                    Save Changes
                                                </button>

                                                <button
                                                    className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 py-3.5 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 active:scale-95"
                                                    onClick={() => {
                                                        setEditMode(false);
                                                        setPreview(getImageUrl(user.image));
                                                        setFormData({
                                                            username: user.username || "",
                                                            phone_number: user.phone_number || "",
                                                            image: null,
                                                        });
                                                    }}
                                                >
                                                    <FaTimes className="w-5 h-5" />
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3.5 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 active:scale-95"
                                                onClick={() => setEditMode(true)}
                                            >
                                                <FaEdit className="w-5 h-5" />
                                                Edit Profile
                                            </button>
                                        )}

                                        <button
                                            className="w-full flex items-center justify-center gap-2 border-2 border-red-500 text-red-600 py-3.5 rounded-xl font-semibold hover:bg-red-50 hover:border-red-600 transition-all duration-200 active:scale-95"
                                            onClick={handleLogout}
                                        >
                                            <FaSignOutAlt className="w-5 h-5" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Details & Tabs */}
                        <div className="lg:col-span-2">
                            {/* Tab Navigation */}
                            <div className="flex border-b border-gray-200 mb-6">
                                <button
                                    className={`px-6 py-3 text-lg font-medium border-b-2 transition-colors ${
                                        activeTab === "profile"
                                            ? "border-indigo-600 text-indigo-700"
                                            : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                                    onClick={() => setActiveTab("profile")}
                                >
                                    Personal Information
                                </button>
                               
                              
                            </div>

                            {/* Profile Information */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">
                                    Personal Details
                                </h3>

                                <div className="space-y-6">
                                    {/* Email */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3 mb-2 sm:mb-0">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                                <FaEnvelope className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-700">Email Address</p>
                                                <p className="text-sm text-gray-500">Your primary email for communication</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">{user.email}</p>
                                            <p className="text-sm text-green-600">Verified</p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3 mb-2 sm:mb-0">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                                <FaPhone className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-700">Phone Number</p>
                                                <p className="text-sm text-gray-500">For order updates and support</p>
                                            </div>
                                        </div>
                                        <div>
                                            {editMode ? (
                                                <input
                                                    type="text"
                                                    name="phone_number"
                                                    value={formData.phone_number}
                                                    onChange={handleChange}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                    placeholder="Enter phone number"
                                                />
                                            ) : (
                                                <p className="font-medium text-gray-900">
                                                    {user.phone_number || "Not added"}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Additional Information */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="p-4 border border-gray-200 rounded-xl">
                                            <div className="flex items-center gap-3 mb-2">
                                                <FaUser className="w-5 h-5 text-gray-500" />
                                                <span className="font-medium text-gray-700">Username</span>
                                            </div>
                                            <p className="text-gray-900">{user.username}</p>
                                        </div>

                                        <div className="p-4 border border-gray-200 rounded-xl">
                                            <div className="flex items-center gap-3 mb-2">
                                                <FaShieldAlt className="w-5 h-5 text-gray-500" />
                                                <span className="font-medium text-gray-700">Account Status</span>
                                            </div>
                                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                                Active
                                            </span>
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="pt-6 border-t border-gray-200">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                            Quick Actions
                                        </h4>
                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                onClick={() => navigate("/MyOrders")}
                                                className="px-4 py-2.5 bg-indigo-50 text-indigo-700 font-medium rounded-xl hover:bg-indigo-100 transition-colors"
                                            >
                                                View Orders
                                            </button>
                                            <button
                                                onClick={() => navigate("/ViewWishList")}
                                                className="px-4 py-2.5 bg-indigo-50 text-indigo-700 font-medium rounded-xl hover:bg-indigo-100 transition-colors"
                                            >
                                                View Wishlist
                                            </button>
                                            <button
                                                onClick={() => navigate("/cart")}
                                                className="px-4 py-2.5 bg-indigo-50 text-indigo-700 font-medium rounded-xl hover:bg-indigo-100 transition-colors"
                                            >
                                                Go to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info Section */}
                            <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    Account Security
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Keep your account secure with these tips:
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                                        <span className="text-gray-700">Use a strong, unique password</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                                        <span className="text-gray-700">Enable two-factor authentication</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                                        <span className="text-gray-700">Regularly review your account activity</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;