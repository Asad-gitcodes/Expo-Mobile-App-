import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import "dotenv/config";

// Initialize the Redis client
const redis = Redis.fromEnv();  // Make sure Redis environment variables are properly set in .env

// Initialize the rate limiter
const ratelimit = new Ratelimit({
  redis: redis,  // Use 'redis' instead of 'refis' for Redis client
  limiter: Ratelimit.slidingWindow(2, '60s')  // Correct usage of sliding window with 2 requests per 60 seconds
});

export default ratelimit;
