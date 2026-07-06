import 'dotenv/config'

export const config = {
  port: Number(process.env.PORT) || 8080,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  kafkaBrokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  webhookTargetUrl: process.env.WEBHOOK_TARGET_URL || 'http://localhost:9000/callback',
  maxGeoPrecisionMeters: Number(process.env.MAX_GEO_PRECISION_METERS) || 10,
  geohashPrecisionChars: Number(process.env.GEOHASH_PRECISION_CHARS) || 6,
  idempotencyTtlSeconds: Number(process.env.IDEMPOTENCY_TTL_SECONDS) || 3600,
}
