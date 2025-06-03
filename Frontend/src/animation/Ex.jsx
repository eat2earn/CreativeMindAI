import React, { useEffect } from 'react';
import './Ex.css';

const Ex = () => {
  useEffect(() => {
    let listBg = document.querySelectorAll('.bg');
    let tabs = document.querySelectorAll('.tab');
    let container = document.querySelector('.container');
    let heightDefault = container.offsetHeight;
    let topBefore = 0;

    const handleWheel = (event) => {
      event.preventDefault();
      const scrollSpeed = 0.2;
      const scrollValue = window.scrollY + (event.deltaY / 3) * scrollSpeed;
      window.scrollTo(0, scrollValue);

      let top = scrollValue;
      listBg.forEach((bg, index) => {
        if (index != 0) {
          bg.animate({
            transform: `translateY(${-top * index}px)`
          }, { duration: 1000, fill: "forwards" });
        }
        if (index == listBg.length - 1) {
          tabs.forEach(tab => {
            tab.animate({
              transform: `translateY(${-top * index}px)`
            }, { duration: 500, fill: "forwards" });
          });

          if (topBefore < top) {
            let setHeight = heightDefault - window.scrollY * index;
            container.animate({
              height: `${setHeight + 100}px`
            }, { duration: 50, fill: "forwards" });
            topBefore = window.scrollY;
          }
        }
        tabs.forEach((tab, index) => {
          if ((tab.offsetTop - top) <= window.innerHeight * (index + 1)) {
            let content = tab.getElementsByClassName('content')[0];
            let transformContent = window.innerHeight * (index + 1) - (tab.offsetTop - top);
            content.animate({
              transform: `translateY(${-transformContent + (100 * index)}px)`
            }, { duration: 500, fill: "forwards" });
          }
        });
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="container">
      <div className="banner">
        <div className="bg-group">
          <div className="bg"></div>
          <div className="bg"></div>
          <div className="bg">
            <h5>Welcome to</h5>
            <h1>CreativeMindAI</h1>
          </div>
          <div className="bg"></div>
          <div className="bg"></div>
        </div>
      </div>
      <div className="tab tab1">
        <div className="content">
          <h5>Welcome to</h5>
          <h2>CreativeMindAI</h2>
          <div className="des">
            CreativeMindAI is a Generative AI-powered creativity platform that provides users with a one-stop solution for AI-driven content generation and media transformation. It integrates multiple AI models to enable text-to-image, image-to-video, background removal, face swapping, generative fill, AI image enhancement, text-to-video, AI-generated audio, voice assistance, and AI chat (similar to ChatGPT and DeepAI).

The project is built using the MERN (MongoDB, Express.js, React.js, Node.js) stack and utilizes powerful AI APIs from OpenAI, Hugging Face, DALL·E, and Cloudinary AI to generate high-quality content.
          </div>
        </div>
      </div>
      <div className="tab tab2">
        <div className="content">
          <h5>Welcome to</h5>
          <h2>CreativeMindAI</h2>
          <div className="des">
            <div>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quaerat autem alias a id distinctio, minus ipsam similique laborum sunt nihil eligendi odio, quidem minima magnam molestias blanditiis. Facere, fuga nulla odio dicta quas molestias blanditiis sed harum repellendus sapiente, impedit ullam. Beatae ipsum error, eos nesciunt libero iure numquam ut neque saepe accusantium, nobis nihil ab voluptas blanditiis reprehenderit. Illo obcaecati ut quis eius alias est facilis. Sint quae exercitationem aut eius, facere ea tempora nulla, illum quo sequi corrupti adipisci aspernatur laudantium consequatur consectetur explicabo cupiditate ratione! Laudantium sunt pariatur sed qui ratione facilis distinctio harum porro alias nemo.
            </div>
            <div>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quaerat autem alias a id distinctio, minus ipsam similique laborum sunt nihil 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ex;