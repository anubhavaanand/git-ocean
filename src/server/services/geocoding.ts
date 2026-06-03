interface GeocodingResult {
  lat: number
  lng: number
  countryCode: string
  countryName: string
  city: string
  confidence: 'high' | 'medium' | 'low'
}

interface CityEntry {
  city: string
  countryCode: string
  countryName: string
  lat: number
  lng: number
  region: string
}

const cityLookup: CityEntry[] = [
  // North America
  { city: 'New York', countryCode: 'US', countryName: 'United States', lat: 40.7128, lng: -74.006, region: 'New York' },
  { city: 'Los Angeles', countryCode: 'US', countryName: 'United States', lat: 34.0522, lng: -118.2437, region: 'California' },
  { city: 'Chicago', countryCode: 'US', countryName: 'United States', lat: 41.8781, lng: -87.6298, region: 'Illinois' },
  { city: 'San Francisco', countryCode: 'US', countryName: 'United States', lat: 37.7749, lng: -122.4194, region: 'California' },
  { city: 'Seattle', countryCode: 'US', countryName: 'United States', lat: 47.6062, lng: -122.3321, region: 'Washington' },
  { city: 'Austin', countryCode: 'US', countryName: 'United States', lat: 30.2672, lng: -97.7431, region: 'Texas' },
  { city: 'Boston', countryCode: 'US', countryName: 'United States', lat: 42.3601, lng: -71.0589, region: 'Massachusetts' },
  { city: 'Denver', countryCode: 'US', countryName: 'United States', lat: 39.7392, lng: -104.9903, region: 'Colorado' },
  { city: 'Miami', countryCode: 'US', countryName: 'United States', lat: 25.7617, lng: -80.1918, region: 'Florida' },
  { city: 'Portland', countryCode: 'US', countryName: 'United States', lat: 45.5152, lng: -122.6784, region: 'Oregon' },
  { city: 'Washington', countryCode: 'US', countryName: 'United States', lat: 38.9072, lng: -77.0369, region: 'District of Columbia' },
  { city: 'Atlanta', countryCode: 'US', countryName: 'United States', lat: 33.749, lng: -84.388, region: 'Georgia' },
  { city: 'Philadelphia', countryCode: 'US', countryName: 'United States', lat: 39.9526, lng: -75.1652, region: 'Pennsylvania' },
  { city: 'Dallas', countryCode: 'US', countryName: 'United States', lat: 32.7767, lng: -96.797, region: 'Texas' },
  { city: 'Houston', countryCode: 'US', countryName: 'United States', lat: 29.7604, lng: -95.3698, region: 'Texas' },
  { city: 'San Diego', countryCode: 'US', countryName: 'United States', lat: 32.7157, lng: -117.1611, region: 'California' },
  { city: 'Phoenix', countryCode: 'US', countryName: 'United States', lat: 33.4484, lng: -112.074, region: 'Arizona' },
  { city: 'Toronto', countryCode: 'CA', countryName: 'Canada', lat: 43.6532, lng: -79.3832, region: 'Ontario' },
  { city: 'Vancouver', countryCode: 'CA', countryName: 'Canada', lat: 49.2827, lng: -123.1207, region: 'British Columbia' },
  { city: 'Montreal', countryCode: 'CA', countryName: 'Canada', lat: 45.5017, lng: -73.5673, region: 'Quebec' },
  { city: 'Ottawa', countryCode: 'CA', countryName: 'Canada', lat: 45.4215, lng: -75.6972, region: 'Ontario' },
  { city: 'Calgary', countryCode: 'CA', countryName: 'Canada', lat: 51.0447, lng: -114.0719, region: 'Alberta' },
  { city: 'Mexico City', countryCode: 'MX', countryName: 'Mexico', lat: 19.4326, lng: -99.1332, region: 'Mexico City' },
  { city: 'Guadalajara', countryCode: 'MX', countryName: 'Mexico', lat: 20.6597, lng: -103.3496, region: 'Jalisco' },
  { city: 'Monterrey', countryCode: 'MX', countryName: 'Mexico', lat: 25.6866, lng: -100.3161, region: 'Nuevo León' },

  // Europe
  { city: 'London', countryCode: 'GB', countryName: 'United Kingdom', lat: 51.5074, lng: -0.1278, region: 'England' },
  { city: 'Manchester', countryCode: 'GB', countryName: 'United Kingdom', lat: 53.4808, lng: -2.2426, region: 'England' },
  { city: 'Edinburgh', countryCode: 'GB', countryName: 'United Kingdom', lat: 55.9533, lng: -3.1883, region: 'Scotland' },
  { city: 'Birmingham', countryCode: 'GB', countryName: 'United Kingdom', lat: 52.4862, lng: -1.8904, region: 'England' },
  { city: 'Glasgow', countryCode: 'GB', countryName: 'United Kingdom', lat: 55.8642, lng: -4.2518, region: 'Scotland' },
  { city: 'Berlin', countryCode: 'DE', countryName: 'Germany', lat: 52.52, lng: 13.405, region: 'Berlin' },
  { city: 'Munich', countryCode: 'DE', countryName: 'Germany', lat: 48.1351, lng: 11.582, region: 'Bavaria' },
  { city: 'Hamburg', countryCode: 'DE', countryName: 'Germany', lat: 53.5511, lng: 9.9937, region: 'Hamburg' },
  { city: 'Frankfurt', countryCode: 'DE', countryName: 'Germany', lat: 50.1109, lng: 8.6821, region: 'Hesse' },
  { city: 'Cologne', countryCode: 'DE', countryName: 'Germany', lat: 50.9375, lng: 6.9603, region: 'North Rhine-Westphalia' },
  { city: 'Paris', countryCode: 'FR', countryName: 'France', lat: 48.8566, lng: 2.3522, region: 'Île-de-France' },
  { city: 'Lyon', countryCode: 'FR', countryName: 'France', lat: 45.764, lng: 4.8357, region: 'Auvergne-Rhône-Alpes' },
  { city: 'Marseille', countryCode: 'FR', countryName: 'France', lat: 43.2965, lng: 5.3698, region: 'Provence-Alpes-Côte d\'Azur' },
  { city: 'Bordeaux', countryCode: 'FR', countryName: 'France', lat: 44.8378, lng: -0.5792, region: 'Nouvelle-Aquitaine' },
  { city: 'Amsterdam', countryCode: 'NL', countryName: 'Netherlands', lat: 52.3676, lng: 4.9041, region: 'North Holland' },
  { city: 'Rotterdam', countryCode: 'NL', countryName: 'Netherlands', lat: 51.9244, lng: 4.4777, region: 'South Holland' },
  { city: 'Stockholm', countryCode: 'SE', countryName: 'Sweden', lat: 59.3293, lng: 18.0686, region: 'Stockholm' },
  { city: 'Gothenburg', countryCode: 'SE', countryName: 'Sweden', lat: 57.7089, lng: 11.9746, region: 'Västra Götaland' },
  { city: 'Oslo', countryCode: 'NO', countryName: 'Norway', lat: 59.9139, lng: 10.7522, region: 'Oslo' },
  { city: 'Copenhagen', countryCode: 'DK', countryName: 'Denmark', lat: 55.6761, lng: 12.5683, region: 'Capital Region' },
  { city: 'Helsinki', countryCode: 'FI', countryName: 'Finland', lat: 60.1699, lng: 24.9384, region: 'Uusimaa' },
  { city: 'Madrid', countryCode: 'ES', countryName: 'Spain', lat: 40.4168, lng: -3.7038, region: 'Community of Madrid' },
  { city: 'Barcelona', countryCode: 'ES', countryName: 'Spain', lat: 41.3874, lng: 2.1686, region: 'Catalonia' },
  { city: 'Valencia', countryCode: 'ES', countryName: 'Spain', lat: 39.4699, lng: -0.3763, region: 'Valencia' },
  { city: 'Rome', countryCode: 'IT', countryName: 'Italy', lat: 41.9028, lng: 12.4964, region: 'Lazio' },
  { city: 'Milan', countryCode: 'IT', countryName: 'Italy', lat: 45.4642, lng: 9.19, region: 'Lombardy' },
  { city: 'Naples', countryCode: 'IT', countryName: 'Italy', lat: 40.8518, lng: 14.2681, region: 'Campania' },
  { city: 'Turin', countryCode: 'IT', countryName: 'Italy', lat: 45.0703, lng: 7.6869, region: 'Piedmont' },
  { city: 'Zurich', countryCode: 'CH', countryName: 'Switzerland', lat: 47.3769, lng: 8.5417, region: 'Zurich' },
  { city: 'Geneva', countryCode: 'CH', countryName: 'Switzerland', lat: 46.2044, lng: 6.1432, region: 'Geneva' },
  { city: 'Bern', countryCode: 'CH', countryName: 'Switzerland', lat: 46.948, lng: 7.4474, region: 'Bern' },
  { city: 'Warsaw', countryCode: 'PL', countryName: 'Poland', lat: 52.2297, lng: 21.0122, region: 'Masovia' },
  { city: 'Krakow', countryCode: 'PL', countryName: 'Poland', lat: 50.0647, lng: 19.945, region: 'Lesser Poland' },
  { city: 'Prague', countryCode: 'CZ', countryName: 'Czech Republic', lat: 50.0755, lng: 14.4378, region: 'Prague' },
  { city: 'Vienna', countryCode: 'AT', countryName: 'Austria', lat: 48.2082, lng: 16.3738, region: 'Vienna' },
  { city: 'Budapest', countryCode: 'HU', countryName: 'Hungary', lat: 47.4979, lng: 19.0402, region: 'Budapest' },
  { city: 'Dublin', countryCode: 'IE', countryName: 'Ireland', lat: 53.3498, lng: -6.2603, region: 'Leinster' },
  { city: 'Brussels', countryCode: 'BE', countryName: 'Belgium', lat: 50.8503, lng: 4.3517, region: 'Brussels-Capital' },
  { city: 'Lisbon', countryCode: 'PT', countryName: 'Portugal', lat: 38.7223, lng: -9.1393, region: 'Lisbon' },
  { city: 'Porto', countryCode: 'PT', countryName: 'Portugal', lat: 41.1579, lng: -8.6291, region: 'Porto' },
  { city: 'Moscow', countryCode: 'RU', countryName: 'Russia', lat: 55.7558, lng: 37.6173, region: 'Moscow' },
  { city: 'Saint Petersburg', countryCode: 'RU', countryName: 'Russia', lat: 59.9343, lng: 30.3351, region: 'Leningrad' },
  { city: 'Kyiv', countryCode: 'UA', countryName: 'Ukraine', lat: 50.4501, lng: 30.5234, region: 'Kyiv' },
  { city: 'Stockholm', countryCode: 'SE', countryName: 'Sweden', lat: 59.3293, lng: 18.0686, region: 'Stockholm' },
  { city: 'Tallinn', countryCode: 'EE', countryName: 'Estonia', lat: 59.437, lng: 24.7536, region: 'Harju' },
  { city: 'Riga', countryCode: 'LV', countryName: 'Latvia', lat: 56.9496, lng: 24.1052, region: 'Riga' },
  { city: 'Vilnius', countryCode: 'LT', countryName: 'Lithuania', lat: 54.6872, lng: 25.2797, region: 'Vilnius' },
  { city: 'Bucharest', countryCode: 'RO', countryName: 'Romania', lat: 44.4268, lng: 26.1025, region: 'Bucharest' },
  { city: 'Sofia', countryCode: 'BG', countryName: 'Bulgaria', lat: 42.6977, lng: 23.3219, region: 'Sofia City' },
  { city: 'Belgrade', countryCode: 'RS', countryName: 'Serbia', lat: 44.7866, lng: 20.4489, region: 'Belgrade' },
  { city: 'Zagreb', countryCode: 'HR', countryName: 'Croatia', lat: 45.815, lng: 15.9819, region: 'City of Zagreb' },
  { city: 'Athens', countryCode: 'GR', countryName: 'Greece', lat: 37.9838, lng: 23.7275, region: 'Attica' },
  { city: 'Reykjavik', countryCode: 'IS', countryName: 'Iceland', lat: 64.1466, lng: -21.9426, region: 'Capital Region' },

  // Asia
  { city: 'Tokyo', countryCode: 'JP', countryName: 'Japan', lat: 35.6762, lng: 139.6503, region: 'Tokyo' },
  { city: 'Osaka', countryCode: 'JP', countryName: 'Japan', lat: 34.6937, lng: 135.5023, region: 'Osaka' },
  { city: 'Kyoto', countryCode: 'JP', countryName: 'Japan', lat: 35.0116, lng: 135.7681, region: 'Kyoto' },
  { city: 'Yokohama', countryCode: 'JP', countryName: 'Japan', lat: 35.4437, lng: 139.638, region: 'Kanagawa' },
  { city: 'Seoul', countryCode: 'KR', countryName: 'South Korea', lat: 37.5665, lng: 126.978, region: 'Seoul' },
  { city: 'Busan', countryCode: 'KR', countryName: 'South Korea', lat: 35.1796, lng: 129.0756, region: 'Busan' },
  { city: 'Beijing', countryCode: 'CN', countryName: 'China', lat: 39.9042, lng: 116.4074, region: 'Beijing' },
  { city: 'Shanghai', countryCode: 'CN', countryName: 'China', lat: 31.2304, lng: 121.4737, region: 'Shanghai' },
  { city: 'Shenzhen', countryCode: 'CN', countryName: 'China', lat: 22.5431, lng: 114.0579, region: 'Guangdong' },
  { city: 'Hong Kong', countryCode: 'HK', countryName: 'Hong Kong', lat: 22.3193, lng: 114.1694, region: 'Hong Kong' },
  { city: 'Taipei', countryCode: 'TW', countryName: 'Taiwan', lat: 25.033, lng: 121.5654, region: 'Taipei' },
  { city: 'Mumbai', countryCode: 'IN', countryName: 'India', lat: 19.076, lng: 72.8777, region: 'Maharashtra' },
  { city: 'Delhi', countryCode: 'IN', countryName: 'India', lat: 28.7041, lng: 77.1025, region: 'Delhi' },
  { city: 'Bangalore', countryCode: 'IN', countryName: 'India', lat: 12.9716, lng: 77.5946, region: 'Karnataka' },
  { city: 'Hyderabad', countryCode: 'IN', countryName: 'India', lat: 17.385, lng: 78.4867, region: 'Telangana' },
  { city: 'Chennai', countryCode: 'IN', countryName: 'India', lat: 13.0827, lng: 80.2707, region: 'Tamil Nadu' },
  { city: 'Kolkata', countryCode: 'IN', countryName: 'India', lat: 22.5726, lng: 88.3639, region: 'West Bengal' },
  { city: 'Pune', countryCode: 'IN', countryName: 'India', lat: 18.5204, lng: 73.8567, region: 'Maharashtra' },
  { city: 'Ahmedabad', countryCode: 'IN', countryName: 'India', lat: 23.0225, lng: 72.5714, region: 'Gujarat' },
  { city: 'Singapore', countryCode: 'SG', countryName: 'Singapore', lat: 1.3521, lng: 103.8198, region: 'Singapore' },
  { city: 'Jakarta', countryCode: 'ID', countryName: 'Indonesia', lat: -6.2088, lng: 106.8456, region: 'Jakarta' },
  { city: 'Bangkok', countryCode: 'TH', countryName: 'Thailand', lat: 13.7563, lng: 100.5018, region: 'Bangkok' },
  { city: 'Hanoi', countryCode: 'VN', countryName: 'Vietnam', lat: 21.0278, lng: 105.8342, region: 'Hanoi' },
  { city: 'Ho Chi Minh City', countryCode: 'VN', countryName: 'Vietnam', lat: 10.8231, lng: 106.6297, region: 'Ho Chi Minh' },
  { city: 'Manila', countryCode: 'PH', countryName: 'Philippines', lat: 14.5995, lng: 120.9842, region: 'Metro Manila' },
  { city: 'Kuala Lumpur', countryCode: 'MY', countryName: 'Malaysia', lat: 3.139, lng: 101.6869, region: 'Kuala Lumpur' },
  { city: 'Dubai', countryCode: 'AE', countryName: 'United Arab Emirates', lat: 25.2048, lng: 55.2708, region: 'Dubai' },
  { city: 'Abu Dhabi', countryCode: 'AE', countryName: 'United Arab Emirates', lat: 24.4539, lng: 54.3773, region: 'Abu Dhabi' },
  { city: 'Tel Aviv', countryCode: 'IL', countryName: 'Israel', lat: 32.0853, lng: 34.7818, region: 'Tel Aviv' },
  { city: 'Jerusalem', countryCode: 'IL', countryName: 'Israel', lat: 31.7683, lng: 35.2137, region: 'Jerusalem' },
  { city: 'Riyadh', countryCode: 'SA', countryName: 'Saudi Arabia', lat: 24.7136, lng: 46.6753, region: 'Riyadh' },
  { city: 'Doha', countryCode: 'QA', countryName: 'Qatar', lat: 25.2854, lng: 51.531, region: 'Doha' },
  { city: 'Muscat', countryCode: 'OM', countryName: 'Oman', lat: 23.588, lng: 58.3829, region: 'Muscat' },
  { city: 'Kuwait City', countryCode: 'KW', countryName: 'Kuwait', lat: 29.3759, lng: 47.9774, region: 'Kuwait' },
  { city: 'Manama', countryCode: 'BH', countryName: 'Bahrain', lat: 26.2285, lng: 50.586, region: 'Capital' },
  { city: 'Ankara', countryCode: 'TR', countryName: 'Turkey', lat: 39.9334, lng: 32.8597, region: 'Ankara' },
  { city: 'Istanbul', countryCode: 'TR', countryName: 'Turkey', lat: 41.0082, lng: 28.9784, region: 'Istanbul' },
  { city: 'Tehran', countryCode: 'IR', countryName: 'Iran', lat: 35.6892, lng: 51.389, region: 'Tehran' },
  { city: 'Tbilisi', countryCode: 'GE', countryName: 'Georgia', lat: 41.7151, lng: 44.8271, region: 'Tbilisi' },
  { city: 'Yerevan', countryCode: 'AM', countryName: 'Armenia', lat: 40.1792, lng: 44.4991, region: 'Yerevan' },
  { city: 'Baku', countryCode: 'AZ', countryName: 'Azerbaijan', lat: 40.4093, lng: 49.8671, region: 'Baku' },
  { city: 'Tashkent', countryCode: 'UZ', countryName: 'Uzbekistan', lat: 41.2995, lng: 69.2401, region: 'Tashkent' },
  { city: 'Almaty', countryCode: 'KZ', countryName: 'Kazakhstan', lat: 43.222, lng: 76.8512, region: 'Almaty' },

  // Oceania
  { city: 'Sydney', countryCode: 'AU', countryName: 'Australia', lat: -33.8688, lng: 151.2093, region: 'New South Wales' },
  { city: 'Melbourne', countryCode: 'AU', countryName: 'Australia', lat: -37.8136, lng: 144.9631, region: 'Victoria' },
  { city: 'Brisbane', countryCode: 'AU', countryName: 'Australia', lat: -27.4698, lng: 153.0251, region: 'Queensland' },
  { city: 'Perth', countryCode: 'AU', countryName: 'Australia', lat: -31.9505, lng: 115.8605, region: 'Western Australia' },
  { city: 'Adelaide', countryCode: 'AU', countryName: 'Australia', lat: -34.9285, lng: 138.6007, region: 'South Australia' },
  { city: 'Canberra', countryCode: 'AU', countryName: 'Australia', lat: -35.2809, lng: 149.13, region: 'Australian Capital Territory' },
  { city: 'Auckland', countryCode: 'NZ', countryName: 'New Zealand', lat: -36.8485, lng: 174.7633, region: 'Auckland' },
  { city: 'Wellington', countryCode: 'NZ', countryName: 'New Zealand', lat: -41.2865, lng: 174.7762, region: 'Wellington' },
  { city: 'Christchurch', countryCode: 'NZ', countryName: 'New Zealand', lat: -43.532, lng: 172.6362, region: 'Canterbury' },

  // South America
  { city: 'São Paulo', countryCode: 'BR', countryName: 'Brazil', lat: -23.5505, lng: -46.6333, region: 'São Paulo' },
  { city: 'Rio de Janeiro', countryCode: 'BR', countryName: 'Brazil', lat: -22.9068, lng: -43.1729, region: 'Rio de Janeiro' },
  { city: 'Brasília', countryCode: 'BR', countryName: 'Brazil', lat: -15.7975, lng: -47.8919, region: 'Federal District' },
  { city: 'Salvador', countryCode: 'BR', countryName: 'Brazil', lat: -12.9714, lng: -38.5014, region: 'Bahia' },
  { city: 'Buenos Aires', countryCode: 'AR', countryName: 'Argentina', lat: -34.6037, lng: -58.3816, region: 'Buenos Aires' },
  { city: 'Córdoba', countryCode: 'AR', countryName: 'Argentina', lat: -31.4201, lng: -64.1888, region: 'Córdoba' },
  { city: 'Santiago', countryCode: 'CL', countryName: 'Chile', lat: -33.4489, lng: -70.6693, region: 'Santiago Metropolitan' },
  { city: 'Lima', countryCode: 'PE', countryName: 'Peru', lat: -12.0464, lng: -77.0428, region: 'Lima' },
  { city: 'Bogotá', countryCode: 'CO', countryName: 'Colombia', lat: 4.711, lng: -74.0721, region: 'Bogotá' },
  { city: 'Medellín', countryCode: 'CO', countryName: 'Colombia', lat: 6.2476, lng: -75.5658, region: 'Antioquia' },
  { city: 'Quito', countryCode: 'EC', countryName: 'Ecuador', lat: -0.1807, lng: -78.4678, region: 'Pichincha' },
  { city: 'Caracas', countryCode: 'VE', countryName: 'Venezuela', lat: 10.4806, lng: -66.9036, region: 'Capital District' },
  { city: 'Montevideo', countryCode: 'UY', countryName: 'Uruguay', lat: -34.9011, lng: -56.1645, region: 'Montevideo' },
  { city: 'Asunción', countryCode: 'PY', countryName: 'Paraguay', lat: -25.2637, lng: -57.5759, region: 'Asunción' },
  { city: 'La Paz', countryCode: 'BO', countryName: 'Bolivia', lat: -16.5, lng: -68.15, region: 'La Paz' },

  // Africa
  { city: 'Cairo', countryCode: 'EG', countryName: 'Egypt', lat: 30.0444, lng: 31.2357, region: 'Cairo' },
  { city: 'Alexandria', countryCode: 'EG', countryName: 'Egypt', lat: 31.2001, lng: 29.9187, region: 'Alexandria' },
  { city: 'Cape Town', countryCode: 'ZA', countryName: 'South Africa', lat: -33.9249, lng: 18.4241, region: 'Western Cape' },
  { city: 'Johannesburg', countryCode: 'ZA', countryName: 'South Africa', lat: -26.2041, lng: 28.0473, region: 'Gauteng' },
  { city: 'Durban', countryCode: 'ZA', countryName: 'South Africa', lat: -29.8587, lng: 31.0218, region: 'KwaZulu-Natal' },
  { city: 'Nairobi', countryCode: 'KE', countryName: 'Kenya', lat: -1.2921, lng: 36.8219, region: 'Nairobi' },
  { city: 'Lagos', countryCode: 'NG', countryName: 'Nigeria', lat: 6.5244, lng: 3.3792, region: 'Lagos' },
  { city: 'Abuja', countryCode: 'NG', countryName: 'Nigeria', lat: 9.0765, lng: 7.3986, region: 'Federal Capital Territory' },
  { city: 'Accra', countryCode: 'GH', countryName: 'Ghana', lat: 5.6037, lng: -0.187, region: 'Greater Accra' },
  { city: 'Casablanca', countryCode: 'MA', countryName: 'Morocco', lat: 33.5731, lng: -7.5898, region: 'Casablanca-Settat' },
  { city: 'Rabat', countryCode: 'MA', countryName: 'Morocco', lat: 34.0209, lng: -6.8416, region: 'Rabat-Salé-Kénitra' },
  { city: 'Tunis', countryCode: 'TN', countryName: 'Tunisia', lat: 36.8065, lng: 10.1815, region: 'Tunis' },
  { city: 'Algiers', countryCode: 'DZ', countryName: 'Algeria', lat: 36.7538, lng: 3.0588, region: 'Algiers' },
  { city: 'Addis Ababa', countryCode: 'ET', countryName: 'Ethiopia', lat: 9.032, lng: 38.7469, region: 'Addis Ababa' },
  { city: 'Dar es Salaam', countryCode: 'TZ', countryName: 'Tanzania', lat: -6.7924, lng: 39.2083, region: 'Dar es Salaam' },
  { city: 'Kampala', countryCode: 'UG', countryName: 'Uganda', lat: 0.3476, lng: 32.5825, region: 'Central' },
  { city: 'Luanda', countryCode: 'AO', countryName: 'Angola', lat: -8.8399, lng: 13.2894, region: 'Luanda' },
  { city: 'Maputo', countryCode: 'MZ', countryName: 'Mozambique', lat: -25.9692, lng: 32.5732, region: 'Maputo' },
  { city: 'Harare', countryCode: 'ZW', countryName: 'Zimbabwe', lat: -17.8252, lng: 31.0335, region: 'Harare' },
  { city: 'Lusaka', countryCode: 'ZM', countryName: 'Zambia', lat: -15.3875, lng: 28.3228, region: 'Lusaka' },
  { city: 'Kigali', countryCode: 'RW', countryName: 'Rwanda', lat: -1.9441, lng: 30.0619, region: 'Kigali' },
  { city: 'Dakar', countryCode: 'SN', countryName: 'Senegal', lat: 14.7167, lng: -17.4677, region: 'Dakar' },
  { city: 'Abidjan', countryCode: 'CI', countryName: 'Côte d\'Ivoire', lat: 5.36, lng: -4.0083, region: 'Abidjan' },
  { city: 'Khartoum', countryCode: 'SD', countryName: 'Sudan', lat: 15.5007, lng: 32.5599, region: 'Khartoum' },

  // Middle East / Central Asia
  { city: 'Islamabad', countryCode: 'PK', countryName: 'Pakistan', lat: 33.6844, lng: 73.0479, region: 'Islamabad Capital' },
  { city: 'Karachi', countryCode: 'PK', countryName: 'Pakistan', lat: 24.8607, lng: 67.0011, region: 'Sindh' },
  { city: 'Lahore', countryCode: 'PK', countryName: 'Pakistan', lat: 31.5497, lng: 74.3436, region: 'Punjab' },
  { city: 'Dhaka', countryCode: 'BD', countryName: 'Bangladesh', lat: 23.8103, lng: 90.4125, region: 'Dhaka' },
  { city: 'Colombo', countryCode: 'LK', countryName: 'Sri Lanka', lat: 6.9271, lng: 79.8612, region: 'Western' },
  { city: 'Kathmandu', countryCode: 'NP', countryName: 'Nepal', lat: 27.7172, lng: 85.324, region: 'Bagmati' },
  { city: 'Kabul', countryCode: 'AF', countryName: 'Afghanistan', lat: 34.5553, lng: 69.2075, region: 'Kabul' },
  { city: 'Yangon', countryCode: 'MM', countryName: 'Myanmar', lat: 16.8403, lng: 96.15, region: 'Yangon' },
  { city: 'Phnom Penh', countryCode: 'KH', countryName: 'Cambodia', lat: 11.5564, lng: 104.9282, region: 'Phnom Penh' },
  { city: 'Vientiane', countryCode: 'LA', countryName: 'Laos', lat: 17.9757, lng: 102.6331, region: 'Vientiane' },
  { city: 'Ulaanbaatar', countryCode: 'MN', countryName: 'Mongolia', lat: 47.8864, lng: 106.9057, region: 'Ulaanbaatar' },
]

function normalizeLocation(input: string): string {
  return input.trim().replace(/\s+/g, ' ')
}

function findCityByName(city: string): CityEntry | undefined {
  const normalized = city.trim().toLowerCase()
  return cityLookup.find(
    (entry) => entry.city.toLowerCase() === normalized,
  )
}

function findCitiesInCountry(countryName: string): CityEntry[] {
  const normalized = countryName.trim().toLowerCase()
  return cityLookup.filter(
    (entry) =>
      entry.countryName.toLowerCase() === normalized ||
      entry.countryCode.toLowerCase() === normalized,
  )
}

function parseLocationString(location: string): { city?: string; region?: string; country?: string } {
  const parts = location.split(',').map((p) => p.trim()).filter(Boolean)

  if (parts.length === 3) {
    return { city: parts[0], region: parts[1], country: parts[2] }
  }
  if (parts.length === 2) {
    return { city: parts[0], country: parts[1] }
  }
  if (parts.length === 1) {
    return { city: parts[0] }
  }
  return {}
}

function getCountryCenter(countryCode: string): { lat: number; lng: number } | undefined {
  const cities = cityLookup.filter((c) => c.countryCode === countryCode)
  if (cities.length === 0) return undefined
  const lat = cities.reduce((sum, c) => sum + c.lat, 0) / cities.length
  const lng = cities.reduce((sum, c) => sum + c.lng, 0) / cities.length
  return { lat, lng }
}

export function geocodeLocation(locationString: string): GeocodingResult {
  const input = normalizeLocation(locationString)
  if (!input) {
    return {
      lat: 0,
      lng: 0,
      countryCode: 'XX',
      countryName: 'Unknown',
      city: 'Unknown',
      confidence: 'low',
    }
  }

  const parsed = parseLocationString(input)

  if (parsed.city) {
    const match = findCityByName(parsed.city)
    if (match) {
      return {
        lat: match.lat,
        lng: match.lng,
        countryCode: match.countryCode,
        countryName: match.countryName,
        city: match.city,
        confidence: 'high',
      }
    }
  }

  if (parsed.country) {
    const countryCities = findCitiesInCountry(parsed.country)
    if (countryCities.length > 0) {
      const center = getCountryCenter(countryCities[0]!.countryCode)
      return {
        lat: center?.lat ?? 0,
        lng: center?.lng ?? 0,
        countryCode: countryCities[0]!.countryCode,
        countryName: countryCities[0]!.countryName,
        city: parsed.city || countryCities[0]!.countryName,
        confidence: 'medium',
      }
    }
  }

  if (parsed.city) {
    const fuzzy = cityLookup.find(
      (entry) =>
        entry.city.toLowerCase().includes(parsed.city!.toLowerCase()) ||
        parsed.city!.toLowerCase().includes(entry.city.toLowerCase()),
    )
    if (fuzzy) {
      return {
        lat: fuzzy.lat,
        lng: fuzzy.lng,
        countryCode: fuzzy.countryCode,
        countryName: fuzzy.countryName,
        city: fuzzy.city,
        confidence: 'medium',
      }
    }
  }

  return {
    lat: 0,
    lng: 0,
    countryCode: 'XX',
    countryName: 'Unknown',
    city: input,
    confidence: 'low',
  }
}

export function searchLocations(query: string): GeocodingResult[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return []

  const results = cityLookup.filter(
    (entry) =>
      entry.city.toLowerCase().includes(normalized) ||
      entry.countryName.toLowerCase().includes(normalized) ||
      entry.countryCode.toLowerCase().includes(normalized) ||
      entry.region.toLowerCase().includes(normalized),
  )

  return results.map((entry) => ({
    lat: entry.lat,
    lng: entry.lng,
    countryCode: entry.countryCode,
    countryName: entry.countryName,
    city: entry.city,
    confidence: 'high' as const,
  }))
}

export function getAllCountries(): { countryCode: string; countryName: string; lat: number; lng: number }[] {
  const countryMap = new Map<string, { countryCode: string; countryName: string; lat: number; lng: number }>()

  for (const entry of cityLookup) {
    if (!countryMap.has(entry.countryCode)) {
      countryMap.set(entry.countryCode, {
        countryCode: entry.countryCode,
        countryName: entry.countryName,
        lat: entry.lat,
        lng: entry.lng,
      })
    }
  }

  return Array.from(countryMap.values())
}

export function getCityCount(): number {
  return cityLookup.length
}

export function getCitiesByCountry(countryCode: string): CityEntry[] {
  return cityLookup.filter((c) => c.countryCode === countryCode)
}

export type { GeocodingResult, CityEntry }
