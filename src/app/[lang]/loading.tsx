/** Instant placeholder while a page's `params` / content resolve (keyed per child route). */
export default function Loading() {
  return (
    <div aria-busy className="mx-auto max-w-7xl animate-pulse space-y-4 px-4 py-16">
      <div className="h-10 w-1/3 rounded bg-neutral-200" />
      <div className="h-64 rounded-xl bg-neutral-100" />
    </div>
  );
}
