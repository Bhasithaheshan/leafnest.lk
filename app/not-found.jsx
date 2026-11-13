import Link from "next/link";
export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <h1 className="text-4xl font-extrabold text-forest">Page not found</h1>
      <p className="mt-3 text-charcoal/75">That page doesn’t exist, or the product has been removed.</p>
      <Link href="/shop" className="mt-8 inline-block rounded-full bg-forest px-7 py-3.5 font-semibold text-cream hover:bg-nature">Back to shop</Link>
    </div>
  );
}
