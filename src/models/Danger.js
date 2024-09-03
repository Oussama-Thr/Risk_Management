import mongoose from "mongoose";

// Utility function to calculate riskValue based on weighted risks
const calculateRiskValue = (danger) => {
  const riskWeights = {
    terrorism: 5,
    meteo: 2,
    health_issues: 4,
    poison: 4,
    natural_disasters: 5,
    political_unrest: 3,
    economic_crisis: 2,
    car_crashes: 2,
    fires: 4,
    carnivors_zones: 3,
    robberies: 3,
    scams: 2,
    over_tourism: 1,
  };

  let totalRisk = 0;
  let totalWeight = 0;

  for (const [risk, weight] of Object.entries(riskWeights)) {
    totalRisk += parseInt(danger[risk], 10) * weight;
    totalWeight += weight;
  }

  // Calculate the weighted average and round to two decimal places
  return (totalRisk / totalWeight).toFixed(2);
};

// Define the Danger schema
const dangerSchema = new mongoose.Schema({
  city: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  terrorism: { type: String, required: true, default: "0" },
  meteo: { type: String, required: true, default: "0" },
  health_issues: { type: String, required: true, default: "0" },
  poison: { type: String, required: true, default: "0" },
  natural_disasters: { type: String, required: true, default: "0" },
  political_unrest: { type: String, required: true, default: "0" },
  economic_crisis: { type: String, required: true, default: "0" },
  car_crashes: { type: String, required: true, default: "0" },
  fires: { type: String, required: true, default: "0" },
  carnivors_zones: { type: String, required: true, default: "0" },
  robberies: { type: String, required: true, default: "0" },
  scams: { type: String, required: true, default: "0" },
  over_tourism: { type: String, required: true, default: "0" },
  riskValue: { type: String },
});

// Pre-save hook to calculate riskValue before saving
dangerSchema.pre('save', function (next) {
  this.riskValue = calculateRiskValue(this);
  next();
});

// Create the Danger model
const Danger = mongoose.models.Danger || mongoose.model("Danger", dangerSchema);

export default Danger;