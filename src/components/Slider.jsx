import React, { useEffect, useState } from "react";

import img1 from "../assets/SliderImgs/horizoncopper-keyart.jpg";
import img2 from "../assets/SliderImgs/hogwarts-legacy.jpg";
import img3 from "../assets/SliderImgs/epic-savings.jpeg";
import img4 from "../assets/SliderImgs/may-the-4th.jpeg";
import img5 from "../assets/SliderImgs/mongil-star.jpg";
import img6 from "../assets/SliderImgs/first-light.jpg";

import { LanguageContext } from "../context/LanguageContext";
import { useContext } from "react";

const slidesData = [
  {
    id: 1,
    titleKey: "slide1Title",
    subtitleKey: "slide1Subtitle",
    descriptionKey: "slide1Desc",
    mainImage: img1,
    thumbImage: img1,
    thumbTitleKey: "slide1Title",
  },
  {
    id: 2,
    titleKey: "slide2Title",
    subtitleKey: "slide2Subtitle",
    descriptionKey: "slide2Desc",
    mainImage: img2,
    thumbImage: img2,
    thumbTitleKey: "slide2Title",
  },
  {
    id: 3,
    titleKey: "slide3Title",
    subtitleKey: "slide3Subtitle",
    descriptionKey: "slide3Desc",
    mainImage: img3,
    thumbImage: img3,
    thumbTitleKey: "slide3Title",
  },
  {
    id: 4,
    titleKey: "slide4Title",
    subtitleKey: "slide4Subtitle",
    descriptionKey: "slide4Desc",
    mainImage: img4,
    thumbImage: img4,
    thumbTitleKey: "slide4Title",
  },
  {
    id: 5,
    titleKey: "slide5Title",
    subtitleKey: "slide5Subtitle",
    descriptionKey: "slide5Desc",
    mainImage: img5,
    thumbImage: img5,
    thumbTitleKey: "slide5Title",
  },
  {
    id: 6,
    titleKey: "slide6Title",
    subtitleKey: "slide6Subtitle",
    descriptionKey: "slide6Desc",
    mainImage: img6,
    thumbImage: img6,
    thumbTitleKey: "slide6Title",
  },
];

export default function Slider() {
  const { t } = useContext(LanguageContext);
  const slides = slidesData;
  const [activeIndex, setActiveIndex] = useState(0);
  const [oldIndex, setOldIndex] = useState(null);
  const [direction, setDirection] = useState("right");
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      goNext();
    }, 5000);

    return () => clearTimeout(timer);
  }, [activeIndex]);

  const changeSlide = (index, passedDir) => {
    if (index === activeIndex) return;

    let dir = passedDir;
    if (!dir) {
      if (index > activeIndex) dir = "right";
      else dir = "left";

      if (activeIndex === slides.length - 1 && index === 0) dir = "right";
      if (activeIndex === 0 && index === slides.length - 1) dir = "left";
    }

    setDirection(dir);
    setOldIndex(activeIndex);
    setActiveIndex(index);

    setTimeout(() => {
      setOldIndex(null);
    }, 500);
  };

  const goNext = () => {
    const nextIndex = activeIndex === slides.length - 1 ? 0 : activeIndex + 1;
    changeSlide(nextIndex, "right");
  };

  const goPrev = () => {
    const prevIndex = activeIndex === 0 ? slides.length - 1 : activeIndex - 1;
    changeSlide(prevIndex, "left");
  };

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;

    if (distance > 50) {
      goNext();
    }

    if (distance < -50) {
      goPrev();
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto flex gap-4 h-[500px] md:h-[600px] px-4">
      <div
        className="flex-1 relative rounded-xl overflow-hidden h-full bg-[#1a1a1a]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {oldIndex !== null && <Slide slide={slides[oldIndex]} t={t} />}

        <Slide
          slide={slides[activeIndex]}
          key={activeIndex}
          className={direction === "right" ? "slide-in-right" : "slide-in-left"}
          t={t}
        />

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 md:hidden z-20 pointer-events-none">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`w-1.5 h-1.5 rounded-full ${
                activeIndex === index ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="w-[280px] hidden md:flex flex-col justify-between">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            onClick={() => changeSlide(index)}
            className="relative flex items-center gap-4 px-4 flex-1 max-h-[90px] rounded-xl cursor-pointer overflow-hidden group"
          >
            <div
              className={`absolute inset-0 ${
                activeIndex === index
                  ? "bg-[#2a2a2a]"
                  : "group-hover:bg-[#2a2a2a]/50"
              }`}
            />

            {activeIndex === index && (
              <div
                key={activeIndex}
                className="absolute left-0 top-0 h-full bg-white/10 animate-fill"
              />
            )}

            <div className="relative z-10 w-[50px] h-[70px] shrink-0 rounded-lg overflow-hidden bg-gray-600">
              <img
                src={slide.thumbImage}
                alt={slide.thumbTitle}
                className="w-full h-full object-cover"
              />
            </div>

            <div
              className={`relative z-10 text-sm ${
                activeIndex === index
                  ? "text-white font-semibold"
                  : "text-gray-400"
              }`}
            >
              {t(slide.thumbTitleKey)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide({ slide, className = "", t }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <img
        src={slide.mainImage}
        alt={t(slide.titleKey)}
        className="w-full h-full object-cover"
        draggable="false"
      />

      <div className="absolute bottom-0 left-0 w-full p-5 md:p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none">
        <p className="text-gray-300 text-[10px] md:text-xs font-bold mb-1 md:mb-2">
          {t(slide.subtitleKey)}
        </p>

        <h2 className="text-white text-xl md:text-4xl font-bold mb-2 md:mb-4">
          {t(slide.titleKey)}
        </h2>

        <p className="text-gray-200 text-xs md:text-lg mb-4 md:mb-6 max-w-[400px]">
          {t(slide.descriptionKey)}
        </p>

        <button
          type="button"
          className="bg-white text-black text-xs md:text-sm font-bold py-2 px-4 md:py-2.5 md:px-6 rounded hover:bg-gray-200 pointer-events-auto"
        >
          {t("discoverNow")}
        </button>
      </div>
    </div>
  );
}