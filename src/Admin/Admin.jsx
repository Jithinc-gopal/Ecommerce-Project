import React, { useEffect, useState } from "react";
import { FaBox, FaUsers, FaShoppingCart } from "react-icons/fa";
import styles from "./Admin.module.css";
import axios from "axios";
import AdminNavbar from "./Adminnavbar";
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
   LineChart, Line
} from "recharts";



const AdminDashboard = () => {
  const [user, setUser] = useState(0);
  const [product, setProduct] = useState(0);
  const [orders, setOrders] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);


  useEffect(() => {
    async function fetch() {
      try {
        const userData = await axios.get("http://localhost:3000/user");
        const productData = await axios.get("http://localhost:3000/products");

        setUser(userData.data.length);
        setProduct(productData.data.length);

 
       const lineData = userData.data.map((u, index) => ({
  name: u.username, // use email or just `User 1`, `User 2`
  orders: u.orders ? u.orders.length : 0,
}));
setLineChartData(lineData);

        const totalOrder = userData.data.reduce((acc, user) => {
          return acc + (user.orders ? user.orders.length : 0);
        }, 0);
        setOrders(totalOrder);

        // Prepare category data for charts
        const categoriesCount = {};
        productData.data.forEach((p) => {
          categoriesCount[p.category] = (categoriesCount[p.category] || 0) + 1;
        });
        const formatted = Object.keys(categoriesCount).map((cat) => ({
          category: cat,
          count: categoriesCount[cat]
        }));
        setCategoryData(formatted);

      } catch (err) {
        console.log("error occurred", err);
      }
    }
    fetch();
  }, []);
  const summaryData = [
  { name: "Users", count: user },
  { name: "Products", count: product },
  { name: "Orders", count: orders }
];


  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <>
      <AdminNavbar />
      <AdminSidebar />
      <div className={styles.dashboardContent}>
        <h2 className={styles.title}>Dashboard Overview</h2>

        {/* Cards */}
        <div className={styles.cards}>
          <div className={styles.card}>
            <FaBox className={`${styles.icon} ${styles.blue}`} />
            <div>
              <p className={styles.label}>Products</p>
              <h3 className={styles.value}>{product}</h3>
            </div>
          </div>

          <div className={styles.card}>
            <FaUsers className={`${styles.icon} ${styles.green}`} />
            <div>
              <p className={styles.label}>Users</p>
              <h3 className={styles.value}>{user}</h3>
            </div>
          </div>

          <div className={styles.card}>
            <FaShoppingCart className={`${styles.icon} ${styles.orange}`} />
            <div>
              <p className={styles.label}>Orders</p>
              <h3 className={styles.value}>{orders}</h3>
            </div>
          </div>
        </div>

           <div className={styles.chartBox}>
          <h3 className={styles.chartTitle}>Users, Products & Orders</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={summaryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" barSize={80}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
  <div className={styles.chartBox}>
  <h3 className={styles.chartTitle}>Category Distribution</h3>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={categoryData}
        dataKey="count"
        nameKey="category"
        cx="40%"   // shift left to make space for legend
        cy="50%"
        outerRadius={110}
        innerRadius={70}  // ✅ increased inner radius for thicker donut
        label
      >
        {categoryData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend
        layout="vertical"
        align="right"
        verticalAlign="middle"
        formatter={(value, entry, index) => (
          <span style={{ color: COLORS[index % COLORS.length], fontWeight: "500" }}>
            {value}
          </span>
        )}
      />
    </PieChart>
  </ResponsiveContainer>
</div>

{/* Line Chart */}
<div className={styles.chartBox}>
  <h3 className={styles.chartTitle}>User Orders Trend</h3>
  <ResponsiveContainer width="100%" height={400}>
    <LineChart data={lineChartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="orders" stroke="#FF5733" strokeWidth={3} dot={{ r: 5 }} />
    </LineChart>
  </ResponsiveContainer>
</div>




      </div>
    </>
  );
};

export default AdminDashboard;
