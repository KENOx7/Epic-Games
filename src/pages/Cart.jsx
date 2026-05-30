import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Bookmark, CircleDollarSign } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { useAuthStore } from "../store/useAuthStore";
import Checkout from "../components/Checkout";
import { getPrice, getSlug, getReward, getCoverUrl } from "../utils/helpers";

function Cart() {
  const { cart, removeFromCart, clearCart } = useCartStore()
  const { toggleWishlist, isInWishlist } = useWishlistStore()
  const { t } = useLanguageStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  let total = 0
  let discount = 0
  cart.forEach((game) => {
    let newP = getPrice(game.newPrice)
    let oldP = 0
    if (game.oldPrice) {oldP = getPrice(game.oldPrice)} 
    else {oldP = newP}
    total = total + oldP
    if (oldP > newP) {
      let ferq = oldP - newP
      discount = discount + ferq
    }
  })
  const subtotal = total - discount

  const checkoutGame = {
    title: `${cart.length} ${cart.length > 1 ? t("itemsInCart2") : t("itemsInCart1")}`,
    oldPrice: `$${total}`,
    newPrice: subtotal == 0 ? t("Free") : `$${subtotal}`,
    discount: discount > 0 ? `-$${discount}` : null
  }

  if (cart.length == 0) {
    return (
      <div className="max-w-[1200px] mx-auto mt-10 px-4 min-h-[60vh]">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">{t("myCart")}</h1>
        <div className="bg-[#18181c] rounded-xl p-8 sm:p-10 text-center flex flex-col items-center">
          <ShoppingCart size={64} className="mb-4 text-[#3a3a3a]" />
          <h2 className="text-2xl font-bold mb-2">{t("cartEmpty")}</h2>
          <p className="text-gray-400 mb-6">{t("shopGamesApps")}</p>
          <Link to="/" className="bg-[#26bbff] text-black font-bold px-6 py-3 rounded-lg">
            {t("shopGames")}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto mt-8 mb-4 sm:mt-10 px-3 sm:px-4 min-h-[60vh]">
      {checkoutOpen && (
        <Checkout
          game={checkoutGame}
          basePath={cart[0].cartBasePath}
          cartItems={cart}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={() => {
            clearCart()
            setCheckoutOpen(false)
          }}
        />
      )}
      <h1 className="text-3xl sm:text-4xl font-bold mb-8">{t("myCart")}</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          {cart.map((game) => {
            const coverUrl = getCoverUrl(game)
            const inWishlist = isInWishlist(game.title)
            const slug = getSlug(game.title)
            const detailUrl = `/game/${slug}?from=${game.endpoint}`
            return (
              <div key={game.title} className="bg-[#18181c] rounded-xl p-4 flex flex-col sm:flex-row gap-4">
                <div className="flex gap-4 flex-1 min-w-0">
                  <Link to={detailUrl} className="w-[58px] h-[78px] sm:w-[120px] sm:h-[160px] bg-[#111] rounded overflow-hidden block">
                    <img src={coverUrl} alt={game.title} className="w-full h-full object-contain" />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col">
                    {game.genres && (
                      <p className="inline-block bg-[#2a2a2a] text-[10px] sm:text-xs px-2 py-1 rounded text-gray-300 mb-2 font-bold self-start">
                        {game.genres[0]}
                      </p>
                    )}
                    <Link to={detailUrl}>
                      <h2 className="text-lg sm:text-xl font-bold hover:underline">{game.title}</h2>
                    </Link>
                    {game.platform && <p className="text-gray-500 text-xs mt-3">{game.platform}</p>}
                    {game.newPrice != "Free" && (
                      <p className="text-sm text-white mt-auto pt-2">
                        {t("refundable")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="sm:w-auto sm:min-w-[290px] flex flex-col sm:items-end sm:justify-between gap-4">
                  <div className="sm:text-right">
                    <div className="flex flex-wrap items-center sm:justify-end gap-2">
                      {game.discount && (
                        <span className="bg-[#26bbff] text-black text-xs font-bold px-2 py-1 rounded">
                          {game.discount}
                        </span>
                      )}
                      {game.oldPrice && (
                        <span className="text-gray-500 line-through text-sm">{game.oldPrice}</span>
                      )}
                      <span className="text-lg font-bold">{game.newPrice}</span>
                    </div>
                    <p className="text-[#b7d36b] flex items-center gap-2 text-sm mt-4">
                      <CircleDollarSign size={16} className="text-yellow-300" />
                      {t("earnEpicRewards")} ${getReward(game.newPrice)}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
                    <button onClick={() => toggleWishlist(game)}
                      className="border border-[#3a3a3a] px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 min-w-[140px]">
                      <Bookmark size={14} className={inWishlist ? "fill-white" : ""} />
                      {inWishlist ? t("inWishlist") : t("moveToWishlist")}
                    </button>
                    <button onClick={() => removeFromCart(game.title)}
                      className="text-sm text-gray-400 hover:text-white text-right">{t("remove")}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="w-full lg:w-[320px]">
          <div className="bg-[#18181c] rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">{t("summary")}</h2>
            <div className="flex justify-between mb-3 text-sm">
              <span>{t("price")}</span>
              <span>${total}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between mb-3 text-sm">
                <span>{t("discountText")}</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-[#333] pt-4 mb-6 font-bold">
              <span>{t("subtotal")}</span>
              <span>${subtotal}</span>
            </div>
            <button onClick={() => (user ? setCheckoutOpen(true) : navigate("/login"))}
              className="w-full bg-[#26bbff] text-black font-bold py-4 rounded-lg">
              {t("checkOutBtn")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Cart