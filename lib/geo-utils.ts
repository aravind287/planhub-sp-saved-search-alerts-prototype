// ── Company profile (Tarrant Lighting demo) ───────────────────────────────────
export const COMPANY_ZIP  = "76106"
export const COMPANY_CITY = "Fort Worth, TX"

// Pre-computed Haversine distances (miles) from 76106 to each project city
const COMPANY_DISTANCES: Record<string, number> = {
  "Los Angeles, California":   1207,
  "San Jose, California":      1420,
  "Sacramento, California":    1410,
  "Concord, California":       1433,
  "San Diego, California":     1151,
  "Berkeley, California":      1445,
  "Palo Alto, California":     1435,
  "Fresno, California":        1301,
  "San Francisco, California": 1452,
  "Santa Ana, California":     1187,
  "Long Beach, California":    1205,
  "Stockton, California":      1393,
  "Oakland, California":       1445,
  "Riverside, California":     1158,
  "San Mateo, California":     1446,
  "Santa Clara, California":   1424,
  "Pasadena, California":      1202,
  "Inglewood, California":     1214,
  "Sunnyvale, California":     1429,
  "Irvine, California":        1184,
  "San Bernardino, California":1153,
  "Redmond, Washington":       1653,
  "Seattle, Washington":       1659,
  "Tacoma, Washington":        1652,
  "Auburn, Washington":        1645,
  "Bellevue, Washington":      1654,
  "Renton, Washington":        1650,
  "Federal Way, Washington":   1649,
  "Kirkland, Washington":      1657,
  "Everett, Washington":       1666,
  "Bothell, Washington":       1659,
  "Shoreline, Washington":     1664,
  "Issaquah, Washington":      1644,
  "Kent, Washington":          1648,
  "Houston, Texas":             237,
  "Irving, Texas":               23,
  "Austin, Texas":              174,
  "San Antonio, Texas":         240,
  "Fort Worth, Texas":            0,
  "Plano, Texas":                41,
  "El Paso, Texas":             539,
  "Lubbock, Texas":             268,
  "Corpus Christi, Texas":      342,
  "Dallas, Texas":               31,
  "Miami, Florida":            1139,
  "Tampa, Florida":             946,
  "Orlando, Florida":           991,
  "Fort Lauderdale, Florida":  1130,
  "Jacksonville, Florida":      937,
  "Miami Beach, Florida":      1141,
  "Sarasota, Florida":          960,
  "Palm Beach, Florida":       1116,
  "Gainesville, Florida":       912,
  "Tallahassee, Florida":       784,
  "New York, New York":        1398,
  "Bronx, New York":           1408,
  "Brooklyn, New York":        1401,
  "Queens, New York":          1409,
  "Albany, New York":          1452,
  "Buffalo, New York":         1222,
  "Jamaica, New York":         1408,
  "Rochester, New York":       1287,
  "St. George, New York":      1394,
  "Denver, Colorado":           644,
  "Colorado Springs, Colorado": 593,
  "Boulder, Colorado":          668,
  "Portland, Oregon":          1608,
  "Eugene, Oregon":            1588,
  "Salem, Oregon":             1609,
  "Phoenix, Arizona":           854,
  "Tucson, Arizona":            795,
  "Scottsdale, Arizona":        845,
  "Mesa, Arizona":              840,
  "Las Vegas, Nevada":         1040,
  "Reno, Nevada":              1335,
  "Chicago, Illinois":          824,
  "Aurora, Illinois":           794,
  "Atlanta, Georgia":           750,
  "Savannah, Georgia":          947,
  "Decatur, Georgia":           756,
  "Lawrenceville, Georgia":     774,
  "Columbus, Georgia":          718,
  "Charlotte, North Carolina":  959,
  "Durham, North Carolina":    1073,
  "Newark, New Jersey":        1390,
  "Hackensack, New Jersey":    1400,
  "Columbus, Ohio":             938,
  "Cleveland, Ohio":           1049,
  "Philadelphia, Pennsylvania":1325,
  "Pittsburgh, Pennsylvania":  1096,
  "Richmond, Virginia":        1169,
  "Arlington, Virginia":       1206,
  "Linthicum, Maryland":       1235,
  "Rockville, Maryland":       1208,
  "Detroit, Michigan":         1022,
  "Grand Rapids, Michigan":     948,
  "Ann Arbor, Michigan":        992,
  "Minneapolis, Minnesota":     872,
  "Saint Paul, Minnesota":      873,
}

// City-centre coordinates — used for zip-radius filtering
const CITY_COORDS: Record<string, [number, number]> = {
  "Los Angeles, California":    [34.0522, -118.2437],
  "San Jose, California":       [37.3387, -121.8853],
  "Sacramento, California":     [38.5816, -121.4944],
  "Concord, California":        [37.9780, -122.0311],
  "San Diego, California":      [32.7157, -117.1611],
  "Berkeley, California":       [37.8716, -122.2727],
  "Palo Alto, California":      [37.4419, -122.1430],
  "Fresno, California":         [36.7378, -119.7871],
  "San Francisco, California":  [37.7749, -122.4194],
  "Santa Ana, California":      [33.7455, -117.8677],
  "Long Beach, California":     [33.7701, -118.1937],
  "Stockton, California":       [37.9577, -121.2908],
  "Oakland, California":        [37.8044, -122.2712],
  "Riverside, California":      [33.9806, -117.3755],
  "San Mateo, California":      [37.5630, -122.3255],
  "Santa Clara, California":    [37.3541, -121.9552],
  "Pasadena, California":       [34.1478, -118.1445],
  "Inglewood, California":      [33.9617, -118.3531],
  "Sunnyvale, California":      [37.3688, -122.0363],
  "Irvine, California":         [33.6846, -117.8265],
  "San Bernardino, California": [34.1083, -117.2898],
  "Redmond, Washington":        [47.6740, -122.1215],
  "Seattle, Washington":        [47.6062, -122.3321],
  "Tacoma, Washington":         [47.2529, -122.4443],
  "Auburn, Washington":         [47.3073, -122.2285],
  "Bellevue, Washington":       [47.6101, -122.2015],
  "Renton, Washington":         [47.4807, -122.2171],
  "Federal Way, Washington":    [47.3223, -122.3126],
  "Kirkland, Washington":       [47.6815, -122.2087],
  "Everett, Washington":        [47.9787, -122.2021],
  "Bothell, Washington":        [47.7623, -122.2054],
  "Shoreline, Washington":      [47.7557, -122.3419],
  "Issaquah, Washington":       [47.5301, -122.0326],
  "Kent, Washington":           [47.3809, -122.2348],
  "Houston, Texas":             [29.7604,  -95.3698],
  "Irving, Texas":              [32.8140,  -96.9489],
  "Austin, Texas":              [30.2672,  -97.7431],
  "San Antonio, Texas":         [29.4241,  -98.4936],
  "Fort Worth, Texas":          [32.7555,  -97.3308],
  "Plano, Texas":               [33.0198,  -96.6989],
  "El Paso, Texas":             [31.7619, -106.4850],
  "Lubbock, Texas":             [33.5779, -101.8552],
  "Corpus Christi, Texas":      [27.8006,  -97.3964],
  "Dallas, Texas":              [32.7767,  -96.7970],
  "Miami, Florida":             [25.7617,  -80.1918],
  "Tampa, Florida":             [27.9506,  -82.4572],
  "Orlando, Florida":           [28.5383,  -81.3792],
  "Fort Lauderdale, Florida":   [26.1224,  -80.1373],
  "Jacksonville, Florida":      [30.3322,  -81.6557],
  "Miami Beach, Florida":       [25.7907,  -80.1300],
  "Sarasota, Florida":          [27.3364,  -82.5307],
  "Palm Beach, Florida":        [26.7153,  -80.0534],
  "Gainesville, Florida":       [29.6516,  -82.3248],
  "Tallahassee, Florida":       [30.4518,  -84.2807],
  "New York, New York":         [40.7128,  -74.0060],
  "Bronx, New York":            [40.8448,  -73.8648],
  "Brooklyn, New York":         [40.6782,  -73.9442],
  "Queens, New York":           [40.7282,  -73.7949],
  "Albany, New York":           [42.6526,  -73.7562],
  "Buffalo, New York":          [42.8864,  -78.8784],
  "Jamaica, New York":          [40.6925,  -73.8067],
  "Rochester, New York":        [43.1566,  -77.6088],
  "St. George, New York":       [40.6437,  -74.0731],
  "Denver, Colorado":           [39.7392, -104.9903],
  "Colorado Springs, Colorado": [38.8339, -104.8214],
  "Boulder, Colorado":          [40.0150, -105.2705],
  "Portland, Oregon":           [45.5051, -122.6750],
  "Eugene, Oregon":             [44.0521, -123.0868],
  "Salem, Oregon":              [44.9429, -123.0351],
  "Phoenix, Arizona":           [33.4484, -112.0740],
  "Tucson, Arizona":            [32.2226, -110.9747],
  "Scottsdale, Arizona":        [33.4942, -111.9261],
  "Mesa, Arizona":              [33.4152, -111.8315],
  "Las Vegas, Nevada":          [36.1699, -115.1398],
  "Reno, Nevada":               [39.5296, -119.8138],
  "Chicago, Illinois":          [41.8781,  -87.6298],
  "Aurora, Illinois":           [41.7606,  -88.3201],
  "Atlanta, Georgia":           [33.7490,  -84.3880],
  "Savannah, Georgia":          [32.0809,  -81.0912],
  "Decatur, Georgia":           [33.7748,  -84.2963],
  "Lawrenceville, Georgia":     [33.9562,  -83.9880],
  "Columbus, Georgia":          [32.4610,  -84.9877],
  "Charlotte, North Carolina":  [35.2271,  -80.8431],
  "Durham, North Carolina":     [35.9940,  -78.8986],
  "Newark, New Jersey":         [40.7357,  -74.1724],
  "Hackensack, New Jersey":     [40.8860,  -74.0437],
  "Columbus, Ohio":             [39.9612,  -82.9988],
  "Cleveland, Ohio":            [41.4993,  -81.6944],
  "Philadelphia, Pennsylvania": [39.9526,  -75.1652],
  "Pittsburgh, Pennsylvania":   [40.4406,  -79.9959],
  "Richmond, Virginia":         [37.5407,  -77.4360],
  "Arlington, Virginia":        [38.8799,  -77.1067],
  "Linthicum, Maryland":        [39.2084,  -76.6651],
  "Rockville, Maryland":        [39.0840,  -77.1528],
  "Detroit, Michigan":          [42.3314,  -83.0458],
  "Grand Rapids, Michigan":     [42.9634,  -85.6681],
  "Ann Arbor, Michigan":        [42.2808,  -83.7430],
  "Minneapolis, Minnesota":     [44.9778,  -93.2650],
  "Saint Paul, Minnesota":      [44.9537,  -93.0900],
}

// Zip-code → coordinates. Covers common test zips + company zip.
export const ZIP_COORDS: Record<string, [number, number]> = {
  // Southern California
  "91311": [34.2592, -118.6044], // Chatsworth (company)
  "91324": [34.2337, -118.5657], // Northridge
  "91302": [34.1409, -118.6445], // Calabasas
  "91350": [34.3950, -118.5398], // Santa Clarita
  "91362": [34.2181, -118.8676], // Thousand Oaks
  "91301": [34.1684, -118.7126], // Agoura Hills
  "90001": [33.9731, -118.2479], // Los Angeles
  "90025": [34.0367, -118.4468], // West LA
  "90210": [34.0901, -118.4065], // Beverly Hills
  "90401": [34.0195, -118.4912], // Santa Monica
  "91101": [34.1478, -118.1445], // Pasadena
  "90301": [33.9617, -118.3531], // Inglewood
  "90802": [33.7701, -118.1937], // Long Beach
  "92101": [32.7157, -117.1611], // San Diego downtown
  "92612": [33.6846, -117.8265], // Irvine
  "92701": [33.7455, -117.8677], // Santa Ana
  "92501": [33.9806, -117.3755], // Riverside
  "92401": [34.1083, -117.2898], // San Bernardino
  // Northern California
  "94102": [37.7749, -122.4194], // San Francisco
  "94612": [37.8044, -122.2712], // Oakland
  "94710": [37.8716, -122.2727], // Berkeley
  "94301": [37.4419, -122.1430], // Palo Alto
  "95113": [37.3387, -121.8853], // San Jose
  "95050": [37.3541, -121.9552], // Santa Clara
  "94086": [37.3688, -122.0363], // Sunnyvale
  "94401": [37.5630, -122.3255], // San Mateo
  "95814": [38.5816, -121.4944], // Sacramento
  "93721": [36.7378, -119.7871], // Fresno
  "95202": [37.9577, -121.2908], // Stockton
  // Pacific Northwest
  "98101": [47.6062, -122.3321], // Seattle
  "98004": [47.6101, -122.2015], // Bellevue
  "98052": [47.6740, -122.1215], // Redmond
  "98401": [47.2529, -122.4443], // Tacoma
  "97201": [45.5051, -122.6750], // Portland
  "97401": [44.0521, -123.0868], // Eugene
  // Southwest
  "85001": [33.4484, -112.0740], // Phoenix
  "85251": [33.4942, -111.9261], // Scottsdale
  "85701": [32.2226, -110.9747], // Tucson
  "89101": [36.1699, -115.1398], // Las Vegas
  "80202": [39.7392, -104.9903], // Denver
  "80901": [38.8339, -104.8214], // Colorado Springs
  // Texas
  "76106": [32.7555,  -97.3308], // Fort Worth (company)
  "77002": [29.7604,  -95.3698], // Houston
  "75201": [32.7767,  -96.7970], // Dallas
  "78701": [30.2672,  -97.7431], // Austin
  "78205": [29.4241,  -98.4936], // San Antonio
  "76102": [32.7555,  -97.3308], // Fort Worth
  "79901": [31.7619, -106.4850], // El Paso
  // East / Southeast
  "30301": [33.7490,  -84.3880], // Atlanta
  "33101": [25.7617,  -80.1918], // Miami
  "33602": [27.9506,  -82.4572], // Tampa
  "32801": [28.5383,  -81.3792], // Orlando
  "10001": [40.7484,  -74.0060], // New York
  "60601": [41.8827,  -87.6233], // Chicago
  "19102": [39.9526,  -75.1652], // Philadelphia
  "20001": [38.9072,  -77.0369], // Washington DC
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

/** Miles from company zip (76106) to a project's location string — for the Distance column */
export function getCompanyDistance(location: string): number | null {
  const precomputed = COMPANY_DISTANCES[location]
  if (precomputed !== undefined) return precomputed
  // fallback: compute from city coords if available
  const coords = CITY_COORDS[location]
  if (!coords) return null
  return Math.round(haversine(32.7555, -97.3308, coords[0], coords[1]))
}

/** Formatted label for the Distance column: "25 mi" or "—" */
export function getCompanyDistanceLabel(location: string): string {
  const d = getCompanyDistance(location)
  return d !== null ? `${d} mi` : "—"
}

/** Miles from an arbitrary zip code to a project location — for the zip/radius filter */
export function distanceFromZip(zip: string, location: string): number | null {
  const zipCoords = ZIP_COORDS[zip.trim()]
  const cityCoords = CITY_COORDS[location]
  if (!zipCoords || !cityCoords) return null
  return haversine(zipCoords[0], zipCoords[1], cityCoords[0], cityCoords[1])
}
