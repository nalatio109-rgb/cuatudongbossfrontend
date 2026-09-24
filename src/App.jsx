import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Products from "./components/Products";
import Projects from "./components/Projects";
import WhyChooseUs from "./components/WhyChooseUs";
import Workflow from "./components/Workflow";
import News from "./components/News";
import Partners from "./components/Partners";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Products />
      <Projects />
      <WhyChooseUs />
      <Workflow />
      <News />
      <Partners />
      <Footer />
    </>
  );
}
