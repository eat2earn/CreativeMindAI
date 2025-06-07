import React from 'react'
import Header from '../components/Header'
import Steps from '../components/Steps'
import Description from '../components/Description'
import Testimonials from '../components/Testimonials'
import ExploreBtn from '../components/ExploreBtn'
import TeamCarousel from '../components/TeamCarousel'

const Home = () => {
  return (
    <div className="text-gray-800">
    
      <Header />
      <Steps />
      <Description />
      <Testimonials />
      <TeamCarousel />
      <div className="flex justify-center items-center w-full">
        <ExploreBtn />
      </div>
    </div>
  )
}

export default Home
