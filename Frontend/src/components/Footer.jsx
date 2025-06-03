import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="bg-gray-800 w-full">
      {/* Main Footer Content */}
      <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Company Info */}
          <div className="space-y-4 text-center sm:text-left">
            <img src={assets.logo_1} alt="CreativeMindAI Logo" className="w-32 sm:w-40 mx-auto sm:mx-0" />
            <p className="text-gray-100 text-sm max-w-xs mx-auto sm:mx-0">
              Empowering creativity through artificial intelligence. We help businesses and individuals transform their ideas into reality.
            </p>
            <div className="flex gap-4 justify-center sm:justify-start">
              <a href="#" className="hover:opacity-80 transition-opacity">
                <img src={assets.facebook_icon} alt="Facebook" className="w-6 h-6 sm:w-8 sm:h-8" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <img src={assets.instagram_icon} alt="Instagram" className="w-6 h-6 sm:w-8 sm:h-8" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <img src={assets.twitter_icon} alt="Twitter" className="w-6 h-6 sm:w-8 sm:h-8" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-100">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-100 hover:text-violet-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-100 hover:text-violet-400 transition-colors">Our Services</a></li>
              <li><a href="#" className="text-gray-100 hover:text-violet-400 transition-colors">AI Solutions</a></li>
              <li><a href="#" className="text-gray-100 hover:text-violet-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-100">Contact Us</h3>
            <div className="space-y-2">
              <p className="text-gray-100 text-sm sm:text-base">Email: info@creativemindai.com</p>
              <p className="text-gray-100 text-sm sm:text-base">Phone: +91 78278 xxxxx</p>
              <p className="text-gray-100 text-sm sm:text-base">Address: Sult Almora Uttarkhand</p>
            </div>
          </div>
        </div>
      </div>

      {/* Download App Section */}
      <div className="bg-violet-600 py-6 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white text-center md:text-left">
              <h2 className="text-xl font-semibold">Get Our Mobile App</h2>
              <p className="text-sm mt-1">Experience CreativeMindAI on the go</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-violet-700 hover:bg-violet-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current w-6 h-6 sm:w-7 sm:h-7">
                  <path d="M 5.4160156 2.328125 L 12.935547 10.158203 C 13.132547 10.363203 13.45925 10.363203 13.65625 10.158203 L 15.179688 8.5742188 C 15.405688 8.3392188 15.354312 7.956875 15.070312 7.796875 C 11.137313 5.571875 6.2620156 2.811125 5.4160156 2.328125 z M 3.140625 2.8476562 C 3.055625 3.0456562 3 3.2629063 3 3.5039062 L 3 20.591797 C 3 20.788797 3.044375 20.970625 3.109375 21.140625 L 11.576172 12.324219 C 11.762172 12.131219 11.762172 11.826813 11.576172 11.632812 L 3.140625 2.8476562 z M 17.443359 9.2578125 C 17.335484 9.2729375 17.233297 9.32375 17.154297 9.40625 L 15.015625 11.632812 C 14.829625 11.825812 14.829625 12.130219 15.015625 12.324219 L 17.134766 14.529297 C 17.292766 14.694297 17.546141 14.729188 17.744141 14.617188 C 19.227141 13.777188 20.226563 13.212891 20.226562 13.212891 C 20.725562 12.909891 21.007 12.443547 21 11.935547 C 20.992 11.439547 20.702609 10.981938 20.224609 10.710938 C 20.163609 10.676937 19.187672 10.124359 17.763672 9.3183594 C 17.664172 9.2623594 17.551234 9.2426875 17.443359 9.2578125 z M 13.296875 13.644531 C 13.165875 13.644531 13.034047 13.696328 12.935547 13.798828 L 5.4746094 21.566406 C 6.7566094 20.837406 11.328781 18.249578 15.050781 16.142578 C 15.334781 15.981578 15.386156 15.599281 15.160156 15.363281 L 13.65625 13.798828 C 13.55775 13.696328 13.427875 13.644531 13.296875 13.644531 z"></path>
                </svg>
                <span className="flex flex-col items-start ml-3 leading-none">
                  <span className="text-xs">GET IT ON</span>
                  <span className="font-semibold text-sm sm:text-base">Google Play</span>
                </span>
              </button>
              <button className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-violet-700 hover:bg-violet-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="fill-current w-6 h-6 sm:w-7 sm:h-7">
                  <path d="M 44.527344 34.75 C 43.449219 37.144531 42.929688 38.214844 41.542969 40.328125 C 39.601563 43.28125 36.863281 46.96875 33.480469 46.992188 C 30.46875 47.019531 29.691406 45.027344 25.601563 45.0625 C 21.515625 45.082031 20.664063 47.03125 17.648438 47 C 14.261719 46.96875 11.671875 43.648438 9.730469 40.699219 C 4.300781 32.429688 3.726563 22.734375 7.082031 17.578125 C 9.457031 13.921875 13.210938 11.773438 16.738281 11.773438 C 20.332031 11.773438 22.589844 13.746094 25.558594 13.746094 C 28.441406 13.746094 30.195313 11.769531 34.351563 11.769531 C 37.492188 11.769531 40.8125 13.480469 43.1875 16.433594 C 35.421875 20.691406 36.683594 31.78125 44.527344 34.75 Z M 31.195313 8.46875 C 32.707031 6.527344 33.855469 3.789063 33.4375 1 C 30.972656 1.167969 28.089844 2.742188 26.40625 4.78125 C 24.878906 6.640625 23.613281 9.398438 24.105469 12.066406 C 26.796875 12.152344 29.582031 10.546875 31.195313 8.46875 Z"></path>
                </svg>
                <span className="flex flex-col items-start ml-3 leading-none">
                  <span className="text-xs">Download on the</span>
                  <span className="font-semibold text-sm sm:text-base">App Store</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-gray-900 text-white py-4 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs sm:text-sm">
            © 2024 CreativeMindAI. All rights reserved. | Designed with ❤️ for the future of AI
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer