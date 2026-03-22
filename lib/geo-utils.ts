// ── Company profile (SEC SOL demo) ────────────────────────────────────────────
export const COMPANY_ZIP  = "91311"
export const COMPANY_CITY = "Chatsworth, CA"

// Pre-computed Haversine distances (miles) from 91311 to each project city
const COMPANY_DISTANCES: Record<string, number> = {
  "Los Angeles, California":    25,
  "San Jose, California":      281,
  "Sacramento, California":    339,
  "Concord, California":       320,
  "San Diego, California":     135,
  "Berkeley, California":      323,
  "Palo Alto, California":     296,
  "Fresno, California":        184,
  "San Francisco, California": 323,
  "Santa Ana, California":      55,
  "Long Beach, California":     41,
  "Stockton, California":      296,
  "Oakland, California":       319,
  "Riverside, California":      73,
  "San Mateo, California":     309,
  "Santa Clara, California":   278,
  "Pasadena, California":       27,
  "Inglewood, California":      25,
  "Sunnyvale, California":     279,
  "Irvine, California":         60,
  "San Bernardino, California": 76,
  "Redmond, Washington":      1108,
  "Seattle, Washington":      1107,
  "Tacoma, Washington":       1082,
  "Auburn, Washington":       1089,
  "Bellevue, Washington":     1098,
  "Renton, Washington":       1093,
  "Federal Way, Washington":  1085,
  "Kirkland, Washington":     1101,
  "Everett, Washington":      1121,
  "Bothell, Washington":      1112,
  "Shoreline, Washington":    1109,
  "Issaquah, Washington":     1095,
  "Kent, Washington":         1090,
  "Houston, Texas":           1456,
  "Irving, Texas":            1393,
  "Austin, Texas":            1415,
  "San Antonio, Texas":       1388,
  "Fort Worth, Texas":        1394,
  "Plano, Texas":             1397,
  "El Paso, Texas":            742,
  "Lubbock, Texas":           1037,
  "Corpus Christi, Texas":    1409,
  "Dallas, Texas":            1394,
  "Miami, Florida":           2350,
  "Tampa, Florida":           2185,
  "Orlando, Florida":         2200,
  "Fort Lauderdale, Florida": 2347,
  "Jacksonville, Florida":    2150,
  "Miami Beach, Florida":     2352,
  "Sarasota, Florida":        2181,
  "Palm Beach, Florida":      2330,
  "Gainesville, Florida":     2203,
  "Tallahassee, Florida":     2108,
  "New York, New York":       2453,
  "Bronx, New York":          2458,
  "Brooklyn, New York":       2456,
  "Queens, New York":         2457,
  "Albany, New York":         2480,
  "Buffalo, New York":        2386,
  "Jamaica, New York":        2459,
  "Rochester, New York":      2411,
  "St. George, New York":     2460,
  "Denver, Colorado":          853,
  "Colorado Springs, Colorado":886,
  "Boulder, Colorado":         845,
  "Portland, Oregon":          959,
  "Eugene, Oregon":            882,
  "Salem, Oregon":             920,
  "Phoenix, Arizona":          371,
  "Tucson, Arizona":           443,
  "Scottsdale, Arizona":       366,
  "Mesa, Arizona":             366,
  "Las Vegas, Nevada":         245,
  "Reno, Nevada":              467,
  "Chicago, Illinois":        1748,
  "Aurora, Illinois":         1742,
  "Atlanta, Georgia":         1854,
  "Savannah, Georgia":        2047,
  "Decatur, Georgia":         1855,
  "Lawrenceville, Georgia":   1866,
  "Columbus, Georgia":        1944,
  "Charlotte, North Carolina":2138,
  "Durham, North Carolina":   2218,
  "Newark, New Jersey":       2443,
  "Hackensack, New Jersey":   2447,
  "Columbus, Ohio":           2102,
  "Cleveland, Ohio":          2115,
  "Philadelphia, Pennsylvania":2393,
  "Pittsburgh, Pennsylvania": 2286,
  "Richmond, Virginia":       2322,
  "Arlington, Virginia":      2329,
  "Linthicum, Maryland":      2375,
  "Rockville, Maryland":      2345,
  "Detroit, Michigan":        2099,
  "Grand Rapids, Michigan":   1998,
  "Ann Arbor, Michigan":      2074,
  "Minneapolis, Minnesota":   1620,
  "Saint Paul, Minnesota":    1618,
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

/** Miles from company zip (91311) to a project's location string — for the Distance column */
export function getCompanyDistance(location: string): number | null {
  const precomputed = COMPANY_DISTANCES[location]
  if (precomputed !== undefined) return precomputed
  // fallback: compute from city coords if available
  const coords = CITY_COORDS[location]
  if (!coords) return null
  return Math.round(haversine(34.2592, -118.6044, coords[0], coords[1]))
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
