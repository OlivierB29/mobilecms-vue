export function parseCoordinates(value) {
  if (!value) return []
  return value
    .replace(/\s+/g, '')
    .split(',')
    .filter(Boolean)
    .map((item) => Number.parseFloat(item))
}

export function getLongitude(gps) {
  return gps[1]
}

export function getLatitude(gps) {
  return gps[0]
}

export function getVector(a, b) {
  return a.map((value, index) => b[index] - value)
}

export function convertGpsToXY(gps, firstPoi, vector) {
  const x = firstPoi.map[0] + (getLongitude(gps) - firstPoi.getLongitude()) * (vector.map[0] / vector.getLongitude())
  const y = firstPoi.map[1] + (getLatitude(gps) - firstPoi.getLatitude()) * (vector.map[1] / vector.getLatitude())
  return [x, y]
}

export function buildCoordinateModel(gps, map) {
  const gpsValues = Array.isArray(gps) ? gps : parseCoordinates(gps)
  const mapValues = Array.isArray(map) ? map : parseCoordinates(map)

  return {
    gps: gpsValues,
    map: mapValues,
    getLongitude() {
      return this.gps[1]
    },
    getLatitude() {
      return this.gps[0]
    }
  }
}
