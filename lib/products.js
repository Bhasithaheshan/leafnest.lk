// Product catalogue & categories for Leafnest.lk
// Specialising exclusively in high quality artificial plants, pots, and accessories.
import seededProducts from "@/data/products.json";

export const categories = [
  {
    slug: "artificial-plants",
    aliases: ["artificial", "plants"],
    name: "Artificial Plants",
    art: "artificial",
    tint: "#EFEBDD",
    image: "/images/cat-artificial.webp",
    hdImage: "/images/cat-artificial-hd.jpg",
    blurb: "Lasting beauty, no watering, zero care",
    description: "Ultra-realistic artificial botanical foliage that stays vibrant green forever with no watering, sunlight, or fuss.",
  },
  {
    slug: "pots-planters",
    aliases: ["plant-pots", "pots"],
    name: "Pots & Planters",
    art: "pot",
    tint: "#E8E4DA",
    image: "/images/cat-pots.webp",
    hdImage: "/images/cat-pots-hd.jpg",
    blurb: "Stylish pots for every space",
    description: "Ceramic, ribbed stone, terracotta, and lightweight modern planters designed to pair with artificial plants.",
  },
  {
    slug: "accessories-decor",
    aliases: ["gardening-accessories", "accessories", "decor"],
    name: "Accessories & Décor",
    art: "tool",
    tint: "#DDE8DC",
    image: "/images/cat-accessories.webp",
    hdImage: "/images/cat-accessories-hd.jpg",
    blurb: "Stands, cans & home accents",
    description: "Watering cans, plant display stands, and nature-inspired décor to make your spaces greener.",
  },
];

export const products = (Array.isArray(seededProducts) && seededProducts.length > 0)
  ? seededProducts.map((p) => ({
      ...p,
      art:
        p.category === "pots-planters"
          ? "pot"
          : p.category === "accessories-decor"
          ? "tool"
          : "artificial",
      tint:
        p.category === "pots-planters"
          ? "#E8E4DA"
          : p.category === "accessories-decor"
          ? "#DDE8DC"
          : "#EFEBDD",
    }))
  : [];;

export const getProduct = (slug) => products.find((p) => p.slug === slug);

export const getCategory = (slugOrAlias) => {
  if (!slugOrAlias) return null;
  const needle = slugOrAlias.toLowerCase().trim();
  return categories.find(
    (c) => c.slug === needle || (c.aliases && c.aliases.includes(needle))
  );
};

export const formatPrice = (n) => "Rs. " + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
