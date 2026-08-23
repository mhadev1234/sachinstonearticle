 import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/",
    "/(hi|en|ar|zh|fr|ru)/:path*",
    "/((?!admin|api|_next|_vercel|.*\\..*).*)",
  ],
};