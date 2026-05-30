import { useEffect, useRef, useState } from "react";
import img1 from "../assets/SliderImgs/horizoncopper-keyart.jpg";
import img2 from "../assets/SliderImgs/hogwarts-legacy.jpg";
import img3 from "../assets/SliderImgs/epic-savings.jpeg";
import img4 from "../assets/SliderImgs/may-the-4th.jpeg";
import img5 from "../assets/SliderImgs/mongil-star.jpg";
import img6 from "../assets/SliderImgs/first-light.jpg";
import { useLanguageStore } from "../store/useLanguageStore";

const slides = [
  { id: 1, title: "slide1Title", subtitle: "slide1Subtitle", desc: "slide1Desc", img: img1 },
  { id: 2, title: "slide2Title", subtitle: "slide2Subtitle", desc: "slide2Desc", img: img2 },
  { id: 3, title: "slide3Title", subtitle: "slide3Subtitle", desc: "slide3Desc", img: img3 },
  { id: 4, title: "slide4Title", subtitle: "slide4Subtitle", desc: "slide4Desc", img: img4 },
  { id: 5, title: "slide5Title", subtitle: "slide5Subtitle", desc: "slide5Desc", img: img5 },
  { id: 6, title: "slide6Title", subtitle: "slide6Subtitle", desc: "slide6Desc", img: img6 }
]

function Slider() {
  const { t } = useLanguageStore()
  const [active, setActive] = useState(0)
  const [old, setOld] = useState(-1)
  const [direction, setDirection] = useState("right")
  const touchStart = useRef(0)
  const last = slides.length - 1

  useEffect(() => {
    const timer = setTimeout(() => next(), 5000)
    return () => clearTimeout(timer)
  }, [active])

  const changeSlide = (i, dir) => {
    if (i == active) return
    setDirection(dir)
    setOld(active)
    setActive(i)
    setTimeout(() => setOld(-1), 500)
  }

  const next = () => {
    const i = active == last ? 0 : active + 1
    changeSlide(i, "right")
  }

  const prev = () => {
    const i = active == 0 ? last : active - 1
    changeSlide(i, "left")
  }

  const chooseSlide = (i) => {
    if (i > active) changeSlide(i, "right")
    else changeSlide(i, "left")
  }

  const handleTouchStart = (e) => touchStart.current = e.touches[0].clientX
  const handleTouchEnd = (e) => {
    const distance = touchStart.current - e.changedTouches[0].clientX
    if (distance > 50) next()
    if (distance < -50) prev()
  }

  return (
    <div className="max-w-[1200px] mx-auto flex gap-4 h-[500px] md:h-[600px] px-4">
      <div className="flex-1 relative rounded-xl overflow-hidden h-full bg-[#1a1a1a]" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {old > -1 && <Slide slide={slides[old]} t={t} />}
        <Slide key={active} slide={slides[active]} t={t} className={direction == "right" ? "slide-in-right" : "slide-in-left"} />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 md:hidden z-20">
          {slides.map((slide, i) => (
            <div key={slide.id} className={active == i ? "w-2 h-2 rounded-full bg-white" : "w-2 h-2 rounded-full bg-white/30"} />
          ))}
        </div>
      </div>
      <div className="w-[280px] hidden md:flex flex-col justify-between">
        {slides.map((slide, i) => (
          <div key={slide.id} onClick={() => chooseSlide(i)} className="relative flex items-center gap-4 px-4 flex-1 max-h-[90px] rounded-xl cursor-pointer overflow-hidden">
            <div className={active == i ? "absolute inset-0 bg-[#2a2a2a]" : "absolute inset-0 hover:bg-[#2a2a2a]/50"} />
            {active == i && <div key={active} className="absolute left-0 top-0 h-full bg-white/10 animate-fill" />}
            <div className="relative z-10 w-[50px] h-[70px] flex-none rounded-lg overflow-hidden bg-gray-600">
              <img src={slide.img} alt={t(slide.title)} className="w-full h-full object-cover" />
            </div>
            <div className={active == i ? "relative z-10 text-sm text-white font-semibold" : "relative z-10 text-sm text-gray-400"}>
              {t(slide.title)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
function Slide({ slide, t, className = "" }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <img src={slide.img} alt={t(slide.title)} className="w-full h-full object-cover" draggable="false" />
      <div className="absolute bottom-0 left-0 w-full p-5 md:p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
        <p className="text-gray-300 text-[10px] md:text-xs font-bold mb-1 md:mb-2">{t(slide.subtitle)}</p>
        <h2 className="text-white text-xl md:text-4xl font-bold mb-2 md:mb-4">{t(slide.title)}</h2>
        <p className="text-gray-200 text-xs md:text-lg mb-4 md:mb-6 max-w-[400px]">{t(slide.desc)}</p>
        <button type="button" className="bg-white text-black text-xs md:text-sm font-bold py-2 px-4 md:py-3 md:px-6 rounded hover:bg-gray-200">
          {t("discoverNow")}
        </button>
      </div>
    </div>
  )
}
export default Slider