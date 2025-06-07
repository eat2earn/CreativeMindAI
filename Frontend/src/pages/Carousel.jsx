import React, { useEffect, useRef } from 'react';
import './Carousel.css';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Carousel = () => {
  const carouselRef = useRef(null);
  const listRef = useRef(null);
  const thumbnailRef = useRef(null);
  const timeRunning = 3000;
  let runTimeout = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const list = listRef.current;
    const thumbnail = thumbnailRef.current;
    const carousel = carouselRef.current;

    const next = () => {
      const SliderItemsDom = list.querySelectorAll('.carousel .list .item');
      const thumbnailItemsDom = thumbnail.querySelectorAll('.carousel .thumbnail .item');
      list.appendChild(SliderItemsDom[0]);
      thumbnail.appendChild(thumbnailItemsDom[0]);
      carousel.classList.add('next');

      clearTimeout(runTimeout.current);
      runTimeout.current = setTimeout(() => {
        carousel.classList.remove('next');
      }, timeRunning);
    };

    const prev = () => {
      const SliderItemsDom = list.querySelectorAll('.carousel .list .item');
      const thumbnailItemsDom = thumbnail.querySelectorAll('.carousel .thumbnail .item');
      list.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
      thumbnail.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
      carousel.classList.add('prev');

      clearTimeout(runTimeout.current);
      runTimeout.current = setTimeout(() => {
        carousel.classList.remove('prev');
      }, timeRunning);
    };

    const nextButton = document.getElementById('next');
    const prevButton = document.getElementById('prev');

    nextButton.addEventListener('click', next);
    prevButton.addEventListener('click', prev);

    return () => {
      nextButton.removeEventListener('click', next);
      prevButton.removeEventListener('click', prev);
    };
  }, []);

  return (
    <>
      <header>
        <nav>
          <a href="#">Home</a>
          <a href="#">Contacts</a>
          <a href="#">Info</a>
        </nav>
      </header>

      <div className="carousel" ref={carouselRef}>
        <div className="list" ref={listRef}>
          <div className="item">
            <img src={assets.img1} alt="Slide 1" />
            <div className="content">
              <div className="author">CreativeMindAI</div>
              <div className="topic">Text to Image</div>
              <div className="des">Transform your imagination into stunning visuals with our advanced AI image generation. Create unique artwork from text descriptions in seconds!</div>
              <div className="buttons">
                <button onClick={() => navigate('/app/result')}>TRY NOW</button>
                <button onClick={() => navigate('/app/buy')}>SUBSCRIBE</button>
              </div>
            </div>
          </div>
          <div className="item">
            <img src={assets.img2} alt="Slide 2" />
            <div className="content">
              <div className="author">CreativeMindAI</div>
              <div className="topic">ThinkAI</div>
              <div className="des">Experience the power of AI-driven thinking. Get instant answers, creative solutions, and intelligent insights for any question or task!</div>
              <div className="buttons">
                <button onClick={() => navigate('/creativeMindAI-thinkAI')}>TRY NOW</button>
                <button onClick={() => navigate('/app/buy')}>SUBSCRIBE</button>
              </div>
            </div>
          </div>
          <div className="item">
            <img src={assets.img3} alt="Slide 3" />
            <div className="content">
              <div className="author">CreativeMindAI</div>
              <div className="topic">Background Remover</div>
              <div className="des">Remove backgrounds from any image with perfect precision. Our AI-powered tool makes it easy to create professional-looking transparent backgrounds!</div>
              <div className="buttons">
                <button onClick={() => navigate('/app/remove-background')}>TRY NOW</button>
                <button onClick={() => navigate('/app/buy')}>SUBSCRIBE</button>
              </div>
            </div>
          </div>
          <div className="item">
            <img src={assets.img4} alt="Slide 4" />
            <div className="content">
              <div className="author">CreativeMindAI</div>
              <div className="topic">Text-to-Speech</div>
              <div className="des">Convert your text into natural-sounding speech with multiple voice styles. Perfect for content creators, presentations, and accessibility needs!</div>
              <div className="buttons">
                <button onClick={() => navigate('/tts')}>TRY NOW</button>
                <button onClick={() => navigate('/app/buy')}>SUBSCRIBE</button>
              </div>
            </div>
          </div>
        </div>

        <div className="thumbnail" ref={thumbnailRef}>
          <div className="item"><img src={assets.img1} alt="Thumbnail 1" /></div>
          <div className="item"><img src={assets.img2} alt="Thumbnail 2" /></div>
          <div className="item"><img src={assets.img3} alt="Thumbnail 3" /></div>
          <div className="item"><img src={assets.img4} alt="Thumbnail 4" /></div>
        </div>

        <div className="arrows">
          <button id="prev">&lt;</button>
          <button id="next">&gt;</button>
        </div>

        <div className="time" />
      </div>
    </>
  );
};

export default Carousel;
