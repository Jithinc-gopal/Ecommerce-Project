import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {Navbar }from "../../components/Navbar/Navbar";
import {Products} from "../ProductCard/Products";
import { Banner } from '../../components/Banner/Banner';
import { Footer } from '../../components/Footer/Footer';
// import { About } from './About'

export const Home = () => {
  const nav = useNavigate();

  useEffect(() => {
    const isLogged = localStorage.getItem("isLogged") === "true";
    const role = localStorage.getItem("role");

    // If admin is logged in, redirect to dashboard
    if (isLogged && role === "admin") {
      nav("/Admin", { replace: true });
    }
  }, [nav]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      <main className="flex-1">
        <section className="mb-16">
          <Banner />
        </section>

        <section className="mb-16 px-4">
          <Products />
        </section>

        {/* <section className="mb-16 px-4">
          <About />
        </section> */}
      </main>

      <footer className="bg-gray-800 text-white mt-auto">
        <Footer />
      </footer>
    </div>
  );
};
