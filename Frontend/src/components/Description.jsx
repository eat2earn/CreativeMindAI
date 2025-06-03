import React from 'react';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';
import './Description.css';

const Description = () => {
  return (
    <motion.div 
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="description-container text-gray-100"
    >
      <h1 className="description-title">Generate AI Images</h1>
      <p className="description-subtitle">Bring Creative Vision to Life</p>
      <div className="content-wrapper">
        <img 
          src={assets.sample_img_2} 
          alt="AI generated sample" 
          className="sample-image" 
        />
        <div className="text-content">
          <h2 className="content-title">
            Introducing the AI Website - Your Ultimate Text to Image Generator
          </h2>
          <p className="content-paragraph">
            Effortlessly bring your ideas to life with our free AI image generator. 
            Transform your text into stunning visuals in seconds. Imagine, describe, 
            and see your vision come to life instantly
          </p>
          <p className="content-paragraph">
            Type a text prompt, and our advanced AI will generate high-quality images 
            in seconds. From product visuals to character designs and portraits, even 
            non-existent concepts come to life effortlessly. Unleash limitless 
            creativity with our AI technology.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Description;