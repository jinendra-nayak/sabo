import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return;

  const preferred = request.headers
    .get("accept-language")
    ?.split(",")
    .map((p) => p.split(";")[0].trim().slice(0, 2))
    .find((l) => (locales as readonly string[]).includes(l));

  request.nextUrl.pathname = `/${preferred ?? defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|documents|.*\\..*).*)"],
};
