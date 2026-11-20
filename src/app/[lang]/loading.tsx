/**
 * Instant placeholder while a page's content resolves. It is a full-screen-tall, non-animated block so the
 * footer stays below the fold and nothing jumps (or pulses) when the real page streams in.
 */
export default function Loading() {
  return <div aria-busy className="min-h-[100svh]" />;
}
