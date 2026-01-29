import React from "react";
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaLinkedin,
  FaYoutube,
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaArrowRight,
  FaHeart,
  FaShieldAlt,
  FaTruck,
  FaCreditCard
} from "react-icons/fa";
import { Link } from "react-router-dom";

export const Footer = () => {
  const quickLinks = [
    { name: "Home", path: "/home" },
    { name: "Shop", path: "/home" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" },
  ];

  const categories = [
    "Sunglasses",
    "Reading Glasses",
    "Computer Glasses",
  ];

  const services = [
    { icon: <FaTruck className="w-5 h-5" />, text: "Free Shipping Over ₹2000" },
    { icon: <FaShieldAlt className="w-5 h-5" />, text: "2-Year Warranty" },
    { icon: <FaCreditCard className="w-5 h-5" />, text: "Secure Payment" },
    { icon: <FaHeart className="w-5 h-5" />, text: "30-Day Returns" }
  ];

  const socialLinks = [
    { icon: <FaFacebook className="w-5 h-5" />, href: "https://www.facebook.com/", color: "hover:text-blue-600", bg: "hover:bg-blue-50" },
    { icon: <FaInstagram className="w-5 h-5" />, href: "https://www.instagram.com/", color: "hover:text-pink-600", bg: "hover:bg-pink-50" },
    { icon: <FaTwitter className="w-5 h-5" />, href: "https://twitter.com/", color: "hover:text-blue-400", bg: "hover:bg-blue-50" },
    { icon: <FaLinkedin className="w-5 h-5" />, href: "https://linkedin.com/", color: "hover:text-blue-700", bg: "hover:bg-blue-50" },
    { icon: <FaYoutube className="w-5 h-5" />, href: "https://youtube.com/", color: "hover:text-red-600", bg: "hover:bg-red-50" },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
      
     

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 flex items-center justify-center">
                <span className="text-white font-bold text-xl">VX</span>
              </div>
              <h2 className="text-2xl font-bold text-white">VisionX</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Your trusted destination for premium eyewear. Combining style, comfort, and innovation in every frame.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center ${social.color} ${social.bg} transition-all duration-300 hover:scale-110`}
                  aria-label={`Visit our ${social.icon.type.name} page`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 pb-2 border-b border-gray-800">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                  >
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 pb-2 border-b border-gray-800">
              Categories
            </h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <FaArrowRight className="w-3 h-3 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 pb-2 border-b border-gray-800">
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Email</p>
                  <a href="mailto:eyewear@visionx.com" className="text-gray-400 hover:text-indigo-400 transition-colors">
                    eyewear@visionx.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                  <FaPhone className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Phone</p>
                  <a href="tel:+918590762676" className="text-gray-400 hover:text-indigo-400 transition-colors">
                    +91 85907 62676
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Address</p>
                  <p className="text-gray-400">
                    123 Vision Street,<br />
                    Mumbai, Maharashtra 400001
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 flex items-center justify-center">
                  <div className="text-indigo-400">
                    {service.icon}
                  </div>
                </div>
                <span className="font-medium text-gray-200">{service.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900/80 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                © {new Date().getFullYear()} VisionX Eyewear. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <span className="text-gray-600">•</span>
              <span className="flex items-center gap-1">
                Made with <FaHeart className="w-3 h-3 text-red-500 animate-pulse" /> in India
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center z-50"
        aria-label="Scroll to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
      </button>
    </footer>
  );
};