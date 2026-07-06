const R = 6_371_000

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

export interface Coord {
  latitude: number
  longitude: number
}

export function haversineDistance(a: Coord, b: Coord): number {
  const dLat = toRad(b.latitude - a.latitude)
  const dLng = toRad(b.longitude - a.longitude)
  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)
  const aVal =
    sinDLat * sinDLat +
    Math.cos(toRad(a.latitude)) *
      Math.cos(toRad(b.latitude)) *
      sinDLng * sinDLng
  return R * 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal))
}

export function isInsideCircle(point: Coord, center: Coord, radiusMeters: number): boolean {
  return haversineDistance(point, center) <= radiusMeters
}
