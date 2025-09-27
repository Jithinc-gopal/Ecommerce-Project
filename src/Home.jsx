import React from 'react'
import { Navbar } from './Navbar'
import { Products } from './Products'
// import { About } from './About'
import { Banner } from './Banner'
import { Footer } from './Footer'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export const Home = () => {
  const nav = useNavigate();

  useEffect(() => {
    const isLogged = localStorage.getItem("isLogged") === "true";
    const role = localStorage.getItem("role");

    // If admin is logged in, redirect to dashboard
    if (isLogged && role === "admin") {
      nav("/Admin", { replace: true });
    }
  }, [nav]);

  return (
    <div>
      <Navbar/>
      <Banner/>
      <Products/>
      {/* <About/> */}
      <Footer/>
     
      </div>
  )
}
