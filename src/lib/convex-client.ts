import { ConvexHttpClient } from 'convex/browser'

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string

if (!CONVEX_URL) {
  throw new Error('VITE_CONVEX_URL is not set. Add it to your .env.local file.')
}

export const convexClient = new ConvexHttpClient(CONVEX_URL)
