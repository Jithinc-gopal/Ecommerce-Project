// App.jsx
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from "react-toastify"

import { Login } from '../Pages/Auth/Login'
import { Registration } from '../Pages/Auth/Registration'
import { Home } from '../Pages/Home/Home'
import { Computerglasses } from '../Pages/Category/Computerglasses'
import { Readingglasses } from '../Pages/Category/Readingglasses'
import Sunglasses  from '../Pages/Category/Sunglasses'

import { Cartview } from '../Pages/Cart/Cartview'
import { About } from '../Pages/About/About'
import { Productdetails } from '../Pages/ProductCard/Productdetails'
import { ViewWishList } from '../Pages/Wishlist/ViewWishList'
import { OrderForm } from '../Pages/Orders/OrderForm'
import { Myorders } from '../Pages/Orders/Myorders'
import Profile from "../Pages/Profile/Profile";


import AdminDashboard from '../Admin/Admin'
import AdminProducts from '../Admin/AdminProducts'
import EditProduct from '../Admin/EditProduct'
import  AdminUsers  from '../Admin/AdminUsers'
import { AdminOrders } from '../Admin/AdminOrders'
import AdminViewUserDetails from '../Admin/AdminViewUserDetails';
import { ForgotPassword } from "../Pages/Auth/ForgotPassword";
import { ResetPassword } from "../Pages/Auth/ResetPassword";


import ProtectedRoute from "../ProtectedRoute"

const App = () => {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/Login" element={<Login />} />
        <Route path="/Registration" element={<Registration />} />
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Computerglasses" element={<Computerglasses />} />
        <Route path="/Readingglasses" element={<Readingglasses />} />
        <Route path="/Sunglasses" element={<Sunglasses />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

        {/* Protected (User Only) */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cartview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/productdetails/:id"
          element={
            <ProtectedRoute>
              <Productdetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ViewWishList"
          element={
            <ProtectedRoute>
              <ViewWishList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/OrderForm"
          element={
            <ProtectedRoute>
              <OrderForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/MyOrders"
          element={
            <ProtectedRoute>
              <Myorders />
            </ProtectedRoute>
          }
        />
        
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

        {/* Admin Only Routes */}
        <Route
          path="/Admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AdminProducts"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AdminProducts/edit/:id"
          element={
            <ProtectedRoute adminOnly={true}>
              <EditProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AdminUsers"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
    path="/AdminUsers/:id"
    element={
    <ProtectedRoute adminOnly={true}>
      <AdminViewUserDetails />
    </ProtectedRoute>
  }
/>
        <Route
          path="/AdminOrders"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Toast Messages */}
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  )
}
export default App