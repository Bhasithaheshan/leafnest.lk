"use client";
import { whatsappLink } from "@/lib/config";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  return (
    <aside aria-label="WhatsApp quick chat" className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappLink("Hi Leafnest.lk, I'm interested in your artificial plants and pots.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Leafnest.lk on WhatsApp"
        className="group flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition-all duration-300 hover:bg-[#20bd5a] hover:shadow-xl hover:scale-105"
      >
        <MessageCircle className="h-6 w-6 fill-white" />
        <span className="hidden text-xs font-bold sm:inline-block">
          Order on WhatsApp
        </span>
      </a>
    </aside>
  );
}
