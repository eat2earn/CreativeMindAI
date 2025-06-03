// src/components/TeamCarousel.jsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './TeamCarousel.module.css';
import { teamMembers } from '../assets/assets';

const TeamCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartRef = useRef(0);
  const carouselRef = useRef(null);

  const updateCarousel = (newIndex) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const nextIndex = (newIndex + teamMembers.length) % teamMembers.length;
    setCurrentIndex(nextIndex);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        updateCarousel(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        updateCarousel(currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isAnimating]);

  // Auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        updateCarousel(currentIndex + 1);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, isAnimating]);

  // Touch swipe handling
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEndX;
    const swipeThreshold = 50;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        updateCarousel(currentIndex + 1);
      } else {
        updateCarousel(currentIndex - 1);
      }
    }
  };

  // Calculate card positions
  const getCardPosition = (index) => {
    const totalItems = teamMembers.length;
    const offset = (index - currentIndex + totalItems) % totalItems;
    
    if (offset === 0) return styles.center;
    if (offset === 1) return styles.right1;
    if (offset === 2) return styles.right2;
    if (offset === totalItems - 1) return styles.left1;
    if (offset === totalItems - 2) return styles.left2;
    return styles.hidden;
  };

  return (
    <div className={styles.teamCarousel}>
      <h1 className={styles.aboutTitle}>OUR TEAM</h1>

      <div className={styles.carouselContainer}>
        <button 
          className={`${styles.navArrow} ${styles.left}`} 
          onClick={() => updateCarousel(currentIndex - 1)}
          aria-label="Previous team member"
        >
          ‹
        </button>
        
        <div 
          className={styles.carouselTrack}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          ref={carouselRef}
        >
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className={`${styles.card} ${getCardPosition(index)}`}
              onClick={() => updateCarousel(index)}
              aria-label={`View ${member.name}, ${member.role}`}
            >
              <img 
                src={member.image} 
                alt={member.name} 
                className={styles.cardImage}
                loading="lazy"
              />
            </div>
          ))}
        </div>
        
        <button 
          className={`${styles.navArrow} ${styles.right}`} 
          onClick={() => updateCarousel(currentIndex + 1)}
          aria-label="Next team member"
        >
          ›
        </button>
      </div>

      <div className={styles.memberInfo}>
        <h2 className={styles.memberName}>{teamMembers[currentIndex].name}</h2>
        <p className={styles.memberRole}>{teamMembers[currentIndex].role}</p>
      </div>

      <div className={styles.dots}>
        {teamMembers.map((_, index) => (
          <button 
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => updateCarousel(index)}
            aria-label={`Go to team member ${index + 1}`}
            aria-pressed={index === currentIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamCarousel;