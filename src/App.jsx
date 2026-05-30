import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./index.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAuthStore } from "./store/useAuthStore";

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
}

function App({ children }) {
  const initializeAuthListener = useAuthStore((state) => state.initializeAuthListener)
  useEffect(() => initializeAuthListener(), [initializeAuthListener])

  return (
    <>
      <ScrollToTop />
      <div className="bg-[#101014] min-h-screen text-white">
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}
export default App