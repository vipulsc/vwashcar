import { NextRequest, NextResponse } from "next/server";

// Simple in-memory cache for API responses
const cache = new Map<
  string,
  { data: unknown; timestamp: number; ttl: number }
>();

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  key?: string; // Custom cache key
}

export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > cached.ttl) {
    cache.delete(key);
    return null;
  }

  return cached.data as T;
}

export function setCachedData<T>(
  key: string,
  data: T,
  ttl: number = 5 * 60 * 1000
): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

// Cache middleware for API routes
export function withCache<T>(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: CacheOptions = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const { ttl = 5 * 60 * 1000, key } = options;

    // Generate cache key
    const cacheKey = key || `${req.method}:${req.url}`;

    // Check cache for GET requests
    if (req.method === "GET") {
      const cached = getCachedData(cacheKey);
      if (cached) {
        return NextResponse.json(cached, {
          headers: {
            "X-Cache": "HIT",
            "Cache-Control": `public, max-age=${Math.floor(ttl / 1000)}`,
          },
        });
      }
    }

    // Execute handler
    const response = await handler(req);

    // Cache successful GET responses
    if (req.method === "GET" && response.status === 200) {
      try {
        const data = await response.clone().json();
        setCachedData(cacheKey, data, ttl);
      } catch (error) {
        // Ignore caching errors
      }
    }

    return response;
  };
}

// Utility for generating cache keys
export function generateCacheKey(
  prefix: string,
  params: Record<string, unknown>
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}:${params[key]}`)
    .join("|");
  return `${prefix}:${sortedParams}`;
}
