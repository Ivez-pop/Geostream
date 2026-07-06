import { Redis } from 'ioredis'
import { config } from '@geostream/config'
import ngeohash from 'ngeohash'

export class SpatialIndex {
  private redis: Redis

  constructor() {
    this.redis = new Redis(config.redisUrl)
  }

  async getCandidateFences(latitude: number, longitude: number): Promise<string[]> {
    const hash = ngeohash.encode(latitude, longitude, config.geohashPrecisionChars)
    return this.redis.smembers(`geofence:index:${hash}`)
  }
}
