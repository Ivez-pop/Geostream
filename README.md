# GeoStream

A TypeScript geofencing engine that evaluates GPS coordinates against circular and polygonal boundaries using Haversine distance and Ray-Casting algorithms. Built with a decoupled architecture — API ingestion is separate from spatial processing via Kafka and Redis.

## Problem Statement

Location-aware applications (fleet logistics, ride-hailing, asset tracking) need to continuously check GPS coordinates against virtual boundaries. Doing this at scale introduces three challenges:

- **O(N) checks**: Comparing every coordinate against every geofence becomes CPU-bound as devices and fences grow.
- **Duplicate telemetry**: Mobile networks retransmit data, creating noise that can trigger false transitions.
- **State tracking**: Correctly detecting entry/exit transitions requires maintaining per-device residency state across stateless services.

## Solution Overview

GeoStream decouples ingestion from evaluation using a message broker. Telemetry is accepted immediately (HTTP 202) and processed asynchronously by workers that:

1. Deduplicate coordinates via Redis idempotency cache
2. Narrow candidate geofences using GeoHash spatial indexing
3. Evaluate containment with Haversine (circles) or Ray-Casting (polygons)
4. Track device state in Redis and emit transition events via webhooks

## Features

- **Circular geofence evaluation** — Haversine great-circle distance
- **Polygonal geofence evaluation** — Ray-Casting with vertex boundary guards (prevents double-counting)
- **GeoHash spatial indexing** — reduces per-coordinate checks from O(N) to O(log N)
- **Deduplication** — Redis-backed idempotency with configurable TTL
- **Device state tracking** — Redis residency store (INSIDE / OUTSIDE)
- **Decoupled ingestion** — Kafka-backed async processing pipeline
- **Docker Compose dev environment** — Redis, Kafka, Zookeeper, webhook mock

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| API server | Fastify |
| Message broker | Kafka (via KafkaJS) |
| State / cache | Redis (via ioredis) |
| Spatial index | GeoHash (via ngeohash) |
| Webhook delivery | Axios |
| Validation | Zod |
| Dev runner | tsx |
| Testing | Vitest |
| Infrastructure | Docker Compose |

## Project Structure

```
geostream/
├── apps/
│   ├── api/                  # Fastify HTTP ingestion server
│   │   └── src/index.ts
│   └── worker/               # Spatial processing worker
│       └── src/index.ts
├── packages/
│   ├── config/               # Environment variable loader
│   ├── geometry/             # Haversine & Ray-Casting engines
│   │   ├── haversine.ts
│   │   └── ray-casting.ts
│   ├── spatial/              # GeoHash spatial index (Redis-backed)
│   ├── state/                # Redis idempotency & device residency
│   └── queue/                # Kafka producer / consumer
├── docker-compose.yml        # Redis, Kafka, Zookeeper, webhook mock
├── .env.example
├── package.json
└── tsconfig.json
```

## Installation

```bash
# Clone and install dependencies
git clone https://github.com/your-org/geostream.git
cd geostream
npm install

# Configure environment
cp .env.example .env

# Start backing services (Redis, Kafka, Zookeeper)
docker compose up -d
```

## Usage

Start the API server:

```bash
npm run dev:api
```

Start the spatial processing worker:

```bash
npm run dev:worker
```

Run tests:

```bash
npm test
```

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8080` | HTTP API port |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection URI |
| `KAFKA_BROKERS` | `localhost:9092` | Kafka broker addresses |
| `WEBHOOK_TARGET_URL` | `http://localhost:9000/callback` | Webhook endpoint |
| `MAX_GEO_PRECISION_METERS` | `10` | Coordinate precision limit |
| `GEOHASH_PRECISION_CHARS` | `6` | GeoHash key length |
| `IDEMPOTENCY_TTL_SECONDS` | `3600` | Dedup cache expiry |

## Geometry Pipeline

```
GPS coordinate → GeoHash lookup → candidate fences → evaluation:
  ├── Circular fence → Haversine distance ≤ radius
  └── Polygonal fence → Ray-Casting (odd = inside)
```

The Ray-Casting implementation handles edge cases:
- **Vertical boundary test**: strict inequality (`y_min < y ≤ y_max`) prevents vertex double-counting
- **Horizontal edges**: skipped to avoid division-by-zero
- **Floating-point precision**: x-intersection computed using standard line formula

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push and open a Pull Request

Run `npm test` and `npm run lint` before submitting.

## License

[MIT](LICENSE)
