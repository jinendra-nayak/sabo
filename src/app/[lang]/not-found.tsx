import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-6xl font-extrabold text-brand">404</p>
      <h1 className="mt-4 text-2xl font-bold text-brand">Page not found · પાનું મળ્યું નથી</h1>
      <Link href="/" className="mt-8 inline-block rounded-md bg-brand px-6 py-3 font-semibold text-gold hover:bg-[#1d1d1d] hover:text-gold">Home · હોમ</Link>
    </div>
  );
}
