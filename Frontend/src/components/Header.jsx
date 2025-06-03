import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { motion } from "framer-motion"
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import './Header.css'

const Header = () => {
  const { user, setShowLogin } = useContext(AppContext)
  const navigate = useNavigate()

  const onClickHandler = () => {
    user ? navigate('/app/result') : setShowLogin(true)
  }

  return (
    <motion.div 
      className="header-container text-lime-200"
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <motion.div 
        className="badge"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p>Best Transform Words into Art</p>
        <img src={assets.star_icon} alt="star icon" />
      </motion.div>
      
      <motion.h1 
        className="main-heading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 2 }}
      >
        Transform Words into <span className="art-text">Art</span> in seconds.
      </motion.h1>

      <motion.p 
        className="subtext"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        Unleash boundless creativity with AI – Turn your thoughts into stunning visual art instantly. Just type, and watch the magic unfold.
      </motion.p>

      <motion.button 
        onClick={onClickHandler}
        className="cta-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ default: { duration: 0.5 }, opacity: { delay: 0.8, duration: 1 } }}
      >
        Generate Images
        <img className="star-group" src={assets.star_group} alt="star group" />
      </motion.button>

      <motion.div
        className="image-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        {Array(6).fill('').map((_, index) => (
          <motion.img
            whileHover={{ scale: 1.05 }}
            className="grid-image"
            src={index % 2 === 0 ? assets.sample_img_2 : assets.sample_img_1} 
            alt="sample" 
            key={index} 
            width={70} 
          />
        ))}
      </motion.div>

      <motion.p
        className="footer-text text-lime-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        Generated images from CreativeMindAi
      </motion.p>
    </motion.div>
  )
}

export default Header