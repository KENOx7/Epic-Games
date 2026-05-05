import React, { useState, useEffect } from 'react';

import img1 from '../assets/SliderImgs/horizoncopper-keyart.jpg';
import img2 from '../assets/SliderImgs/hogwarts-legacy.jpg';
import img3 from '../assets/SliderImgs/epic-savings.jpeg';
import img4 from '../assets/SliderImgs/may-the-4th.jpeg';
import img5 from '../assets/SliderImgs/mongil-star.jpg';
import img6 from '../assets/SliderImgs/first-light.jpg';

const slides = [
  {
    id: 1,
    title: 'Fortnite | Star Wars',
    subtitle: 'AVAILABLE NOW',
    description: 'All-new Star Wars Islands have come to Fortnite - everything from single-player role- playing games, to shooters, tycoons and more await!',
    mainImage: img1,
    thumbImage: img1,
    thumbTitle: 'Fortnite | Star Wars',
  },
  {
    id: 2,
    title: 'Hogwarts Legacy',
    subtitle: 'CELEBRATE 25 YEARS OF HARRY POTTER MAGIC!',
    description: 'Play Hogwarts Legacy free and be at the center of your own adventure in the wizarding world.',
    mainImage: img2,
    thumbImage: img2,
    thumbTitle: 'Hogwarts Legacy',
  },
  {
    id: 3,
    title: 'Epic Savings',
    subtitle: 'APRIL 23 - MAY 7',
    description: 'Save big on must-play games and discover new adventures.',
    mainImage: img3,
    thumbImage: img3,
    thumbTitle: 'Epic Savings',
  },
  {
    id: 4,
    title: 'May the 4th Be With You',
    subtitle: 'SPECIAL OFFERS',
    description: 'Celebrate Star Wars day with amazing deals.',
    mainImage: img4,
    thumbImage: img4,
    thumbTitle: 'May the 4th Be With You',
  },
  {
    id: 5,
    title: 'MONGIL: STAR DIVE',
    subtitle: 'NEW RELEASE',
    description: 'Dive into a new adventure in the stars.',
    mainImage: img5,
    thumbImage: img5,
    thumbTitle: 'MONGIL: STAR DIVE',
  },
  {
    id: 6,
    title: '007 First Light',
    subtitle: 'COMING SOON',
    description: 'The iconic spy returns in a new thriller.',
    mainImage: img6,
    thumbImage: img6,
    thumbTitle: '007 First Light',
  }
];

export default function Slider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        if (prevIndex == slides.length - 1) {
          return 0;
        } else {
          return prevIndex + 1;
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto flex gap-4 h-[600px]">
      <div className="w-[1200px] relative rounded-xl overflow-hidden h-full bg-gray-800">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((slide, idx) => (
            <div key={slide.id} className="min-w-full h-full relative">
              {slide.mainImage ? (
                <img
                  src={slide.mainImage}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xl"></div>)}
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/90 pt-32">
                <p className="text-gray-300 text-sm font-bold mb-2">{slide.subtitle}</p>
                <h2 className="text-white text-4xl font-bold mb-4">{slide.title}</h2>
                <p className="text-gray-200 text-lg mb-6 max-w-[400px]">{slide.description}</p>
                <a href="javascript:void(0)" className="inline-block bg-white text-black font-bold py-3 px-8 rounded hover:bg-gray-200">
                  Discover now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-[280px] h-full flex flex-col justify-between">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            onClick={() => setActiveIndex(index)}
            className="relative flex items-center gap-4 px-4 h-[90px] rounded-xl cursor-pointer overflow-hidden group"
          >
            <div className={`absolute inset-0 transition-colors duration-300 ${activeIndex === index ? 'bg-[#2a2a2a]' : 'hover:bg-[#2a2a2a]/50'}`}></div>
            {activeIndex === index && (
              <div className="absolute left-0 top-0 h-full bg-[#3f3f46] animate-fill"></div>
            )}
            <div className="relative z-10 w-[50px] h-[70px] rounded-lg bg-gray-600">
              {slide.thumbImage ? (
                <img src={slide.thumbImage} alt={slide.thumbTitle} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-white/50">Şəkil</div>
              )}
            </div>
            <div className={`relative z-10 text-sm ${activeIndex == index ? 'text-white' : 'text-gray-400'}`}>
              {slide.thumbTitle}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
