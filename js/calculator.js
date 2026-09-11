/**
 * EcoCollect Telangana - Dynamic Weight-Based Points Calculator
 * Rule: As weight increases, points increase progressively with tier multipliers.
 */

const POINTS_CONFIG = {
  // Base Points per Kilogram based on hazard & recyclable material recovery value
  ratesPerKg: {
    smartphones: 160,     // High recovery of gold, silver, rare earths, lithium
    laptops: 140,         // High value PCBs, aluminum, batteries
    appliances: 60,       // Large volume, metals, plastics
    batteries: 190,       // High chemical hazard & cobalt/lithium value
    cables_pcbs: 110,     // Copper & circuitry recovery
    screens_monitors: 85  // Glass, phosphor, PCBs
  },

  // Progressive Bulk Multiplier: Encourages users to collect & recycle larger batches
  getTierMultiplier(weightKg) {
    if (weightKg >= 20) {
      return { multiplier: 1.50, tierName: 'Gold Bulk Recycler (+50% Bonus)', tierBadge: 'Gold Champion' };
    } else if (weightKg >= 10) {
      return { multiplier: 1.35, tierName: 'Silver Eco Batch (+35% Bonus)', tierBadge: 'Silver Recycler' };
    } else if (weightKg >= 4) {
      return { multiplier: 1.20, tierName: 'Bronze Volume (+20% Bonus)', tierBadge: 'Bronze Recycler' };
    } else if (weightKg >= 1.5) {
      return { multiplier: 1.10, tierName: 'Standard Saver (+10% Bonus)', tierBadge: 'Active Saver' };
    }
    return { multiplier: 1.00, tierName: 'Base Scale', tierBadge: 'Eco Pioneer' };
  },

  // Environmental impact multipliers per KG
  environmentalImpact: {
    co2KgPerKgWaste: 2.1,      // 2.1 kg CO2 emissions prevented per kg e-waste diverted
    toxicMetalsGramsPerKg: 35   // ~35g toxic lead/cadmium/mercury kept out of soil
  }
};

/**
 * Calculates total reward points earned for a given weight and category
 * @param {number} weightKg - Total weight in kilograms
 * @param {string} categoryKey - Category identifier
 * @returns {object} Calculated points and environmental savings
 */
function calculatePoints(weightKg, categoryKey) {
  const safeWeight = Math.max(0.1, parseFloat(weightKg) || 0.1);
  const baseRate = POINTS_CONFIG.ratesPerKg[categoryKey] || POINTS_CONFIG.ratesPerKg.smartphones;
  const { multiplier, tierName, tierBadge } = POINTS_CONFIG.getTierMultiplier(safeWeight);

  const basePoints = safeWeight * baseRate;
  const totalPoints = Math.round(basePoints * multiplier);
  const co2PreventedKg = (safeWeight * POINTS_CONFIG.environmentalImpact.co2KgPerKgWaste).toFixed(1);
  const toxicMetalsGrams = Math.round(safeWeight * POINTS_CONFIG.environmentalImpact.toxicMetalsGramsPerKg);

  return {
    weightKg: safeWeight,
    categoryKey,
    baseRate,
    multiplier,
    tierName,
    tierBadge,
    totalPoints,
    co2PreventedKg,
    toxicMetalsGrams
  };
}

// Attach to window
window.PointsCalculator = {
  calculatePoints,
  POINTS_CONFIG
};
