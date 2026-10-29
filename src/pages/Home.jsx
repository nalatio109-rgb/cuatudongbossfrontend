import React from 'react';
import Hero from '../components/Hero';
import Products from '../components/Products';
import Projects from '../components/Projects';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';

import News from '../components/News';
import Partners from '../components/Partners';

const Home = () => {
  return (
    <div className="home-page-wrapper">
      <Hero />
      <Products />
      <Projects />
      <WhyChooseUs />
      <Testimonials />
      <News />
      <Partners />
    </div>
  );
};

export default Home;
