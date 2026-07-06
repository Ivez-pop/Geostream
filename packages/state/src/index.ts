import { Redis } from 'ioredis'
import { config } from '@geostream/config'

export type FenceState = 'INSIDE' | 'OUTSIDE'

export class StateStore {
  private redis: Redis

  constructor() {
    this.redis = new Redis(config.redisUrl)
  }

  async checkIdempotency(key: string): Promise<boolean> {
    const ok = await this.redis.set(key, '1', 'EX', config.idempotencyTtlSeconds, 'NX')
    return ok !== null
  }

  async getState(deviceId: string, fenceId: string): Promise<FenceState | null> {
    const val = await this.redis.get(`device:${deviceId}:${fenceId}`)
    return val as FenceState | null
  }

  async setState(deviceId: string, fenceId: string, state: FenceState): Promise<void> {
    await this.redis.set(`device:${deviceId}:${fenceId}`, state)
  }
}
