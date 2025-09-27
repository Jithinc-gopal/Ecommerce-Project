// App.jsx
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from "react-toastify"

import { Login } from './Login'
import { Registration } from './Registration'
import { Home } from './Home'
import { Computerglasses } from './Category/Computerglasses'
import { Readingglasses } from './Category/Readingglasses'
import { Sunglasses } from './Category/sunglasses'
import { Cartview } from './Cartview'
import { About } from './About'
import { Productdetails } from './Productdetails'
import { ViewWishList } from './ViewWishList'
import { OrderForm } from './OrderForm'
import { Myorders } from './Myorders'

import AdminDashboard from './Admin/Admin'
import AdminProducts from './Admin/AdminProducts'
import EditProduct from './Admin/EditProduct'
import { AdminUsers } from './Admin/AdminUsers'
import { AdminOrders } from './Admin/AdminOrders'

import ProtectedRoute from "./ProtectedRoute"

export const App = () => {
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
