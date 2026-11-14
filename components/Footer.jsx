import Link from "next/link";
import Logo from "./Logo";
import { categories } from "@/lib/products";
import { whatsappLink, SOCIAL_LINKS } from "@/lib/config";
import { PhoneCall, Truck, ShieldCheck, Heart } from "lucide-react";

// Official Social Media Icons
function FacebookIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
    </svg>
  );
}

export default function Footer() {
  const socials = [
    {
      name: "Facebook",
      href: SOCIAL_LINKS.facebook,
      icon: FacebookIcon,
      hoverClass: "hover:bg-[#1877F2]",
    },
    {
      name: "Instagram",
      href: SOCIAL_LINKS.instagram,
      icon: InstagramIcon,
      hoverClass: "hover:bg-[#E4405F]",
    },
    {
      name: "TikTok",
      href: SOCIAL_LINKS.tiktok,
      icon: TikTokIcon,
      hoverClass: "hover:bg-[#000000] hover:ring-1 hover:ring-white/20",
    },
  ];

  return (
    <footer id="contact" className="border-t border-neutral-200/80 bg-[#161D18] text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand info & Social Media */}
          <div className="lg:col-span-5">
            <Logo light className="h-9 w-auto sm:h-10 lg:h-11" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-400">
              Leafnest.lk is Sri Lanka&apos;s premier online store for realistic artificial plants, stylish pots, and nature-inspired home décor.
            </p>
            
            {/* Trust badges */}
            <div className="mt-5 flex items-center gap-4 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-emerald-400" />
                Island-wide delivery
              </span>
              <span className="h-3 w-[1px] bg-neutral-700" />
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Safe packaging
              </span>
            </div>

            {/* Social Media Links */}
            <div className="mt-7">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                Follow Us
              </p>
              <div className="flex items-center gap-3">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow Leafnest.lk on ${s.name}`}
                      className={`flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800/90 text-neutral-300 transition-all duration-300 ${s.hoverClass} hover:text-white hover:scale-110 shadow-sm`}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Shop categories */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Shop Categories
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-400">
              <li>
                <Link href="/shop" className="transition-colors hover:text-white">
                  All Products
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/shop?category=${c.slug}`}
                    className="transition-colors hover:text-white"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer support & WhatsApp */}
          <div className="lg:col-span-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Need Help Choosing?
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-neutral-400">
              Message us on WhatsApp for dimensions, styling ideas, or custom planter pairings. We’re always happy to assist.
            </p>
            <div className="mt-5">
              <a
                href={whatsappLink("Hi Leafnest.lk, I have a question about artificial plants and pots.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-bold text-neutral-900 transition-colors hover:bg-neutral-200"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Socials shortcut */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-neutral-800/80 pt-8 text-xs text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Leafnest.lk. All rights reserved. Bring Nature Home.</p>
          <div className="flex items-center gap-4 text-neutral-400">
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Facebook
            </a>
            <span>•</span>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram
            </a>
            <span>•</span>
            <a
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              TikTok
            </a>
          </div>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for Sri Lankan plant lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
