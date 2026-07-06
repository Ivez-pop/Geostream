import type { Coord } from './haversine.js'

export function isInsidePolygon(point: Coord, vertices: Coord[]): boolean {
  let inside = false
  const { latitude: y, longitude: x } = point
  const n = vertices.length

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const { latitude: y1, longitude: x1 } = vertices[i]
    const { latitude: y2, longitude: x2 } = vertices[j]

    if (y1 === y2) continue

    if (y1 > y2) {
      if (y < y2 || y >= y1) continue
    } else {
      if (y < y1 || y >= y2) continue
    }

    const xIntersection = x1 + ((y - y1) * (x2 - x1)) / (y2 - y1)
    if (x < xIntersection) inside = !inside
  }

  return inside
}
