import React from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { 
  FaCheckCircle, 
  FaShippingFast, 
  FaShieldAlt, 
  FaEye, 
  FaPalette,
  FaHeadset,
  FaAward,
  FaGlasses,
  FaUsers,
  FaHeart
} from "react-icons/fa";
import { Link } from "react-router-dom";

export const About = () => {
  const features = [
    {
      icon: <FaCheckCircle className="w-6 h-6" />,
      title: "Wide Selection",
      description: "Choose from 500+ frames & lenses for every style and occasion.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100"
    },
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: "Premium Quality",
      description: "Certified lenses and trusted brands ensuring durability & clarity.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-100"
    },
    {
      icon: <FaShippingFast className="w-6 h-6" />,
      title: "Fast Delivery",
      description: "Quick shipping & easy returns for seamless shopping experience.",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100"
    },
    {
      icon: <FaEye className="w-6 h-6" />,
      title: "UV Protection",
      description: "100% UV protection in all sunglasses for optimal eye safety.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100"
    },
    {
      icon: <FaPalette className="w-6 h-6" />,
      title: "Style Variety",
      description: "Trendy designs that match your personality and lifestyle.",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-100"
    },
    {
      icon: <FaHeadset className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Expert assistance for frame selection and eye care advice.",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100"
    }
  ];

  

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 pt-24 pb-16 md:pt-28 md:pb-20">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-200">VisionX</span>
              </h1>
              <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto mb-10">
                Your vision, our passion. Premium eyewear designed for comfort, clarity, and timeless style.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/home"
                  className="px-8 py-4 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-gray-100 hover:scale-105 transform transition-all duration-200 shadow-lg"
                >
                  Explore Collection
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* Our Story */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"> 
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800">VisionX</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the perfect blend of quality, style, and innovation
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`group relative p-6 lg:p-8 rounded-2xl border ${feature.borderColor} ${feature.bgColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                  <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${feature.color} group-hover:w-full transition-all duration-500`}></div>
                </div>
              ))}
            </div>
          </div>
        </section>

       

        {/* Mission & Vision */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 to-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Mission */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Our Mission
                </div>
                <h3 className="text-3xl md:text-4xl font-bold">
                  Empowering Clear Vision Worldwide
                </h3>
                <p className="text-lg text-gray-300">
                  To make premium eyewear accessible to everyone, blending innovative technology with fashion-forward designs that enhance daily life while protecting eye health.
                </p>
                <ul className="space-y-3">
                  {['Innovative lens technology', 'Sustainable materials', 'Customer-first approach', 'Global accessibility'].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <FaCheckCircle className="text-green-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Vision */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold">
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                  Our Vision
                </div>
                <h3 className="text-3xl md:text-4xl font-bold">
                  Redefining Eyewear Experience
                </h3>
                <p className="text-lg text-gray-300">
                  To become the world's most trusted eyewear brand, setting new standards in comfort, style, and visual technology while making a positive impact on eye health awareness.
                </p>
                <ul className="space-y-3">
                  {['Global brand recognition', 'Revolutionary AR try-on', 'Eco-friendly production', 'Community eye care initiatives'].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <FaCheckCircle className="text-amber-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 md:p-12 overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/10"></div>
              <div className="relative">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                  Ready to See the World Differently?
                </h2>
                <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                  Join thousands of satisfied customers who have found their perfect pair with VisionX.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/home"
                    className="px-8 py-4 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-gray-100 hover:scale-105 transform transition-all duration-200 shadow-lg"
                  >
                    Shop Now
                  </Link>
                 
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};