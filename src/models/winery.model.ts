import mongoose from "mongoose";

// Winery Schema
const WinerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    is_mountain_location: { type: Boolean, required: true },
  },
  contact_info: {
    phone: { type: String },
    email: { type: String },
    website: { type: String },
  },
  description: { type: String },
  images: [{ type: String }],
  tasting_info: {
    price_range: [{ type: Number }],
    available_times: [{ type: String }],
    wine_types: [{ type: String }],
    number_of_wines_per_tasting: [{ type: Number }],
    special_features: [{ type: String }],
    food_pairings_available: { type: Boolean },
  },
  wine_details: [
    {
      name: { type: String, required: true },
      type: { type: String },
      year: { type: Number },
      tasting_notes: { type: String },
      pairing_suggestions: [{ type: String }],
    },
  ],
  ava: { type: String },
  booking_info: {
    booking_enabled: { type: Boolean },
    max_guests_per_slot: { type: Number },
    dynamic_pricing: {
      enabled: { type: Boolean },
      weekend_multiplier: { type: Number },
    },
    available_slots: [{ type: Date }],
  },
  amenities: {
    virtual_sommelier: { type: Boolean },
    augmented_reality_tours: { type: Boolean },
    handicap_accessible: { type: Boolean },
  },
  user_reviews: [
    {
      review_id: { type: String },
      user_id: { type: String },
      rating: { type: Number },
      comment: { type: String },
    },
  ],
  transportation: {
    uber_availability: { type: Boolean },
    lyft_availability: { type: Boolean },
    distance_from_user: { type: Number },
  },
});

// Check if the model is already defined
const Winery = mongoose.models.Winery || mongoose.model("Winery", WinerySchema);

export default Winery;
