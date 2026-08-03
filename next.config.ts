import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /**
   * Emit a folder of static files instead of a server.
   *
   * The site has no API routes, no server actions and no middleware, and every
   * route already prerenders, so a Node process would sit there adding a way
   * for a client demo to go down without adding anything it renders. nginx
   * serves `out/` directly; there is nothing to keep alive, restart, or watch.
   *
   * `next start` does not work under this mode — `npm run dev` is unaffected,
   * and `npx serve out` previews a production build.
   */
  output: 'export',

  /**
   * The optimiser is a server feature, so an export has to opt out. Costs the
   * per-breakpoint resizing on five photographs totalling ~1 MB; those are
   * placeholders awaiting the client's real images, and whoever swaps them in
   * should size them properly at that point.
   */
  images: { unoptimized: true },

  /** Directory-style URLs, so nginx can serve /pencarian/index.html cleanly. */
  trailingSlash: true,

  /**
   * Dev-only, and only about where a badge sits: Next's indicator defaults to
   * the bottom-left corner, which is where the demo switcher lives. They
   * overlapped on `npm run dev`. Nothing in the exported build is affected.
   */
  devIndicators: { position: 'top-left' },
}

export default nextConfig
