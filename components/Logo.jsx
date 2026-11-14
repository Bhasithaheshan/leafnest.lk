import Image from "next/image";

// Official Leafnest.lk logo. `light` = cream version for dark (forest green / black) backgrounds.
export default function Logo({ light = false, className = "h-11 w-auto sm:h-12 lg:h-13" }) {
  return (
    <Image
      src={light ? "/logo-light.png" : "/logo.png"}
      alt="Leafnest.lk"
      width={1200}
      height={333}
      priority
      className={`object-contain ${className}`}
    />
  );
}
