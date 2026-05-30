export const getPrice = (price) => {
  if (!price || price == "Free") return 0
  return Number(String(price).replace("$", ""))
}

export const getReward = (price) => (getPrice(price) * 0.05).toFixed(2)

export const getSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

export const getCoverUrl = (game, basePath = "") => {
  const folder = game.cartBasePath || basePath
  const cover = game.saved_images.find((img) => img == "cover.jpg" || img == "cover.png")
  return `${folder}/${cover}`
}
