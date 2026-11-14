// Official Leafnest.lk WhatsApp Direct DM Configuration
export const WHATSAPP_PHONE = "94775835445";
export const WHATSAPP_BUSINESS_URL = "https://wa.me/94775835445";
export const SITE_NAME = "Leafnest.lk";
export const TAGLINE = "Bring Nature Home";

// Official Social Media Links
export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/share/1DweRAxcai/?mibextid=wwXIfr",
  tiktok: "https://www.tiktok.com/@leafnest.lk",
  instagram: "https://www.instagram.com/leafnest.lk",
};

/**
 * Builds a direct WhatsApp message URL to your WhatsApp Business account
 * @param {string} text - Optional pre-filled message text
 * @returns {string} Formatted WhatsApp URL
 */
export function whatsappLink(text) {
  if (!text) {
    return WHATSAPP_BUSINESS_URL;
  }
  return `${WHATSAPP_BUSINESS_URL}?text=${encodeURIComponent(text)}`;
}
