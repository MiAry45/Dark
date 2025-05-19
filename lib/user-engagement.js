// Context-based product recommendations
const contextRules = {
  timeOfDay: {
    morning: ["milk", "bread", "eggs", "coffee", "cereal"],
    afternoon: ["sandwiches", "salads", "juices", "snacks"],
    evening: ["ready meals", "pasta", "rice", "vegetables"],
    night: ["ice cream", "noodles", "chips", "chocolate", "beverages"],
  },
  weather: {
    sunny: ["ice cream", "cold drinks", "salads", "fruits"],
    rainy: ["chai", "coffee", "maggi", "soup", "umbrellas"],
    cold: ["hot chocolate", "soup", "coffee", "warm meals"],
  },
  festivals: {
    diwali: ["sweets", "dry fruits", "decorations", "gift hampers"],
    christmas: ["cakes", "cookies", "chocolates", "decorations"],
    holi: ["colors", "sweets", "snacks", "beverages"],
  },
}

// Function to get recommendations based on user context
export function getContextRecommendations(userContext) {
  const { time, weather, festival, location } = userContext
  let recommendations = []

  // Add time-based recommendations
  if (time && contextRules.timeOfDay[time]) {
    recommendations = [...recommendations, ...contextRules.timeOfDay[time]]
  }

  // Add weather-based recommendations
  if (weather && contextRules.weather[weather]) {
    recommendations = [...recommendations, ...contextRules.weather[weather]]
  }

  // Add festival-based recommendations
  if (festival && contextRules.festivals[festival]) {
    recommendations = [...recommendations, ...contextRules.festivals[festival]]
  }

  // Remove duplicates
  recommendations = [...new Set(recommendations)]

  return recommendations
}

// Location-based trending products (simplified)
const locationTrends = {
  110001: ["organic vegetables", "premium coffee", "imported chocolates"],
  400001: ["seafood", "coconut water", "local snacks"],
  560001: ["filter coffee", "dosa mix", "local fruits"],
}

// Function to get location-based trending products
export function getLocationTrends(pincode) {
  return locationTrends[pincode] || []
}

// Combine all recommendations for a user
export function getUserRecommendations(userContext) {
  const contextRecs = getContextRecommendations(userContext)
  const locationRecs = getLocationTrends(userContext.pincode)

  // Combine and prioritize recommendations
  return {
    primary: contextRecs.slice(0, 3),
    secondary: [...contextRecs.slice(3), ...locationRecs],
    notifications: [contextRecs[0], locationRecs[0]].filter(Boolean),
  }
}
