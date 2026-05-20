import { Link } from "react-router-dom";
import megaSaleBg from "../assets/mega-sale.png";
import { useLanguageStore } from "../store/useLanguageStore";

export default function MegaSale() {
  const { t } = useLanguageStore()

  return (
    <div className="w-full mt-4 md:mt-0">
      <div className="relative min-h-[550px] sm:min-h-[600px] lg:min-h-[650px] flex items-end justify-center 
                      px-6 py-12 md:pb-24 lg:pb-28 text-center bg-cover bg-top" style={{ backgroundImage: `url(${megaSaleBg})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-[#101014]/60 to-transparent" />
        <div className="relative z-10 max-w-2xl flex flex-col items-center">
          <h3 className="text-white text-xl md:text-2xl font-bold mb-3">{t("megaSaleTitle")}</h3>
          <p className="text-white text-sm md:text-base mb-6 px-4">{t("megaSaleDesc")}</p>
          <Link to="/browse?price=Discounted" className="bg-white text-black font-bold text-sm px-10 py-2.5
                rounded-lg hover:bg-gray-200 mb-4"> {t("saveNow")} </Link>
          <p className="text-white/80 text-[11px] md:text-xs mb-6 bg-black/40 px-4 py-2 rounded-full">{t("saleEnds")}</p>
          <p className="text-white/60 text-[10px] md:text-xs max-w-lg">{t("megaSaleFooterStart")}
            <Link to="#" className="underline hover:text-white"> {t("epicExtrasPage")} </Link> {t("megaSaleFooterEnd")}
          </p>
        </div>
      </div>
    </div>
  );
}