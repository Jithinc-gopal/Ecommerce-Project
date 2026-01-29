// src/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { FaBox, FaUsers, FaShoppingCart } from "react-icons/fa";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import API from "../api/axios";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ users: 0, products: 0, orders: 0 });
  const [categoryData, setCategoryData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get("/custom_admin/dashboard/");
        setCounts(data.counts);
        setCategoryData(data.categories);
        setLineChartData(data.user_orders);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchData();
  }, []);

  const summaryData = [
    { name: "Users", count: counts.users },
    { name: "Products", count: counts.products },
    { name: "Orders", count: counts.orders },
  ];

  const COLORS = ["#facc15", "#fde047", "#f59e0b", "#eab308"];

  return (
    <>
      <AdminNavbar />
      <AdminSidebar />

      <div className="ml-[260px] min-h-screen bg-slate-900 p-6 text-yellow-200 max-md:ml-0">
        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 text-yellow-300">
          Dashboard Overview
        </h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <DashboardCard
            icon={<FaBox />}
            label="Products"
            value={counts.products}
          />
          <DashboardCard
            icon={<FaUsers />}
            label="Users"
            value={counts.users}
          />
          <DashboardCard
            icon={<FaShoppingCart />}
            label="Orders"
            value={counts.orders}
          />
        </div>

        {/* Bar Chart */}
        <ChartBox title="Users, Products & Orders">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={summaryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#fde68a" />
              <YAxis stroke="#fde68a" />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#facc15" barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        {/* Pie Chart */}
        <ChartBox title="Category Distribution">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="count"
                nameKey="category"
                cx="40%"
                cy="50%"
                outerRadius={110}
                innerRadius={70}
                label
              >
                {categoryData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>

        {/* Line Chart */}
        <ChartBox title="User Orders Trend">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#fde68a" />
              <YAxis stroke="#fde68a" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#facc15"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>
    </>
  );
};

/* ===============================
   REUSABLE COMPONENTS
================================ */

const DashboardCard = ({ icon, label, value }) => (
  <div className="bg-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-lg hover:shadow-xl transition">
    <div className="text-3xl p-4 rounded-lg bg-yellow-400 text-slate-900">
      {icon}
    </div>
    <div>
      <p className="text-sm text-yellow-200">{label}</p>
      <h3 className="text-2xl font-bold text-yellow-300">{value}</h3>
    </div>
  </div>
);

const ChartBox = ({ title, children }) => (
  <div className="bg-slate-800 rounded-xl p-6 mb-10 shadow-lg">
    <h3 className="text-lg font-semibold mb-4 text-yellow-300">
      {title}
    </h3>
    {children}
  </div>
);

export default AdminDashboard;
